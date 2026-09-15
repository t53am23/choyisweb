const ACTIVE_PAYMENT_STATUSES = new Set(["initializing", "ready", "pending", "unknown"])

function publicAttempt(attempt) {
  return {
    attemptId: attempt.id,
    operationReference: attempt.operationReference,
    provider: attempt.provider,
    providerReference: attempt.providerReference,
    status: attempt.status,
    checkout: attempt.checkout ?? null,
  }
}

export function createPaymentRouter({ repository, providers, createId = () => crypto.randomUUID() }) {
  async function initializeFrom(operation, startIndex = 0) {
    let lastDefinitiveFailure = null

    for (let index = startIndex; index < providers.length; index += 1) {
      const provider = providers[index]
      if (!provider.enabled) continue

      const attemptId = createId()
      const providerReference = typeof provider.createReference === "function"
        ? provider.createReference({ operation, attemptId })
        : `${operation.reference}-PAY-${attemptId}`
      const attempt = await repository.createPaymentAttempt({
        id: attemptId,
        operationReference: operation.reference,
        provider: provider.name,
        providerReference,
        expectedAmountMinor: operation.amountMinor,
        currency: operation.currency,
        status: "initializing",
      })
      if (attempt.id !== attemptId) return publicAttempt(attempt)
      let initialized
      try {
        initialized = await provider.initialize({ operation, attempt })
      } catch {
        initialized = {
          status: "unknown",
          definitive: false,
          chargePossible: true,
          failureCode: "PROVIDER_INIT_UNKNOWN",
        }
      }
      const updated = await repository.updatePaymentAttempt(attempt.id, initialized)
      if (
        updated.status === "technical_failure"
        && updated.definitive === true
        && updated.chargePossible === false
      ) {
        lastDefinitiveFailure = updated
        continue
      }
      return publicAttempt(updated)
    }

    return lastDefinitiveFailure ? publicAttempt(lastDefinitiveFailure) : null
  }

  return {
    async startPayment(operationReference) {
      const operation = await repository.getOperation(operationReference)
      if (!operation) throw new Error("TopUp operation was not found.")
      if (operation.availabilityStatus !== "available") {
        throw new Error("The requested service is not confirmed available.")
      }

      const active = await repository.getActivePaymentAttempt(operationReference)
      if (active && ACTIVE_PAYMENT_STATUSES.has(active.status)) return publicAttempt(active)

      const latest = typeof repository.getLatestPaymentAttempt === "function"
        ? await repository.getLatestPaymentAttempt(operationReference)
        : null
      const resumeIndex = latest?.status === "technical_failure"
        && latest.definitive === true
        && latest.chargePossible === false
        ? providers.findIndex((candidate) => candidate.name === latest.provider) + 1
        : 0
      const result = await initializeFrom(operation, resumeIndex)
      if (result) return result
      throw new Error("No payment provider is currently enabled.")
    },

    async reconcilePayment(operationReference) {
      const operation = await repository.getOperation(operationReference)
      if (!operation) throw new Error("TopUp operation was not found.")
      if (operation.paymentStatus === "paid") {
        return { operationReference: operation.reference, status: "paid" }
      }

      const attempt = await repository.getActivePaymentAttempt(operationReference)
      if (!attempt) throw new Error("No active payment attempt was found.")
      const provider = providers.find((candidate) => candidate.name === attempt.provider)
      if (!provider || typeof provider.verify !== "function") {
        throw new Error("The payment provider cannot be requeried.")
      }

      let verified
      try {
        verified = await provider.verify({ operation, attempt })
      } catch {
        verified = { status: "unknown", failureCode: "PROVIDER_VERIFY_UNKNOWN" }
      }

      if (verified.status === "paid") {
        const exactReference = verified.providerReference === attempt.providerReference
        const exactAmount = verified.amountPaidMinor === attempt.expectedAmountMinor
        const exactCurrency = String(verified.currency).toUpperCase() === String(attempt.currency).toUpperCase()
        if (!exactReference || !exactAmount || !exactCurrency) {
          const mismatched = await repository.updatePaymentAttempt(attempt.id, {
            status: "amount_mismatch",
            failureCode: "PAYMENT_VERIFICATION_MISMATCH",
            providerTransactionReference: verified.providerTransactionReference ?? null,
          })
          return publicAttempt(mismatched)
        }

        await repository.updatePaymentAttempt(attempt.id, {
          ...verified,
          status: "paid",
        })
        await repository.markPaymentPaid({
          operationReference: operation.reference,
          attemptId: attempt.id,
        })
        return { operationReference: operation.reference, status: "paid" }
      }

      const updated = await repository.updatePaymentAttempt(attempt.id, verified)
      if (
        updated.status === "technical_failure"
        && updated.definitive === true
        && updated.chargePossible === false
      ) {
        const currentIndex = providers.findIndex((candidate) => candidate.name === attempt.provider)
        const fallback = await initializeFrom(operation, currentIndex + 1)
        if (fallback) return fallback
      }
      return publicAttempt(updated)
    },
  }
}
