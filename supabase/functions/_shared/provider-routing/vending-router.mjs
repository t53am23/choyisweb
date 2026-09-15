function publicAvailability(provider, result) {
  return {
    provider,
    status: result.status,
    productCode: result.productCode ?? null,
    validationReference: result.validationReference ?? null,
  }
}

function publicVend(attempt) {
  return {
    attemptId: attempt.id,
    operationReference: attempt.operationReference,
    provider: attempt.provider,
    providerReference: attempt.providerReference,
    status: attempt.status,
    providerTransactionReference: attempt.providerTransactionReference ?? null,
  }
}

function canFallback(attempt) {
  return attempt.status === "failed"
    && attempt.definitive === true
    && attempt.fulfillmentPossible === false
}

export function createVendingRouter({ repository, providers, createId = () => crypto.randomUUID() }) {
  async function providerAvailability(operation, provider) {
    try {
      return await provider.checkAvailability({ operation })
    } catch {
      return { status: "unknown", definitive: false }
    }
  }

  async function vendWith(operation, provider, route) {
    const attemptId = createId()
    const providerReference = typeof provider.createReference === "function"
      ? provider.createReference({ operation, attemptId })
      : `${operation.reference}-VEND-${attemptId}`
    const attempt = await repository.createVendAttempt({
      id: attemptId,
      operationReference: operation.reference,
      provider: provider.name,
      providerReference,
      status: "processing",
    })
    if (attempt.id !== attemptId) return attempt

    let result
    try {
      result = await provider.vend({ operation, attempt, route })
    } catch {
      result = { status: "unknown", definitive: false, failureCode: "PROVIDER_VEND_UNKNOWN" }
    }
    const updated = await repository.updateVendAttempt(attempt.id, result)
    if (updated.status === "delivered") {
      await repository.markDelivered({ operationReference: operation.reference, attemptId: attempt.id })
    }
    return updated
  }

  async function fallbackAfter(operation, providerName, failedAttempt) {
    const currentIndex = providers.findIndex((candidate) => candidate.name === providerName)
    for (const fallback of providers.slice(currentIndex + 1)) {
      if (!fallback.enabled || typeof fallback.checkAvailability !== "function" || typeof fallback.vend !== "function") {
        continue
      }
      const availability = await providerAvailability(operation, fallback)
      if (availability.status === "unavailable" && availability.definitive === true) continue
      if (availability.status !== "available") return failedAttempt

      const route = { provider: fallback.name, ...availability }
      await repository.saveAvailability({ operationReference: operation.reference, status: "available", route })
      const fallbackAttempt = await vendWith(operation, fallback, route)
      if (!canFallback(fallbackAttempt)) return fallbackAttempt
      failedAttempt = fallbackAttempt
    }
    return failedAttempt
  }

  async function finishOrFallback(operation, attempt) {
    if (canFallback(attempt)) return fallbackAfter(operation, attempt.provider, attempt)
    return attempt
  }

  return {
    async checkAvailability(operationReference) {
      const operation = await repository.getOperation(operationReference)
      if (!operation) throw new Error("TopUp operation was not found.")

      for (const provider of providers) {
        if (!provider.enabled) continue
        const result = await providerAvailability(operation, provider)
        if (result.status === "available") {
          const route = { provider: provider.name, ...result }
          await repository.saveAvailability({ operationReference: operation.reference, status: "available", route })
          return publicAvailability(provider.name, result)
        }
        if (result.status !== "unavailable" || result.definitive !== true) {
          await repository.saveAvailability({
            operationReference: operation.reference,
            status: "unknown",
            route: { provider: provider.name, ...result },
          })
          return publicAvailability(provider.name, { ...result, status: "unknown" })
        }
      }

      await repository.saveAvailability({ operationReference: operation.reference, status: "unavailable", route: null })
      return { provider: null, status: "unavailable", productCode: null, validationReference: null }
    },

    async vendPaidOperation(operationReference) {
      const operation = await repository.getOperation(operationReference)
      if (!operation) throw new Error("TopUp operation was not found.")
      if (operation.paymentStatus !== "paid") throw new Error("Customer payment has not been confirmed.")
      if (operation.availabilityStatus !== "available" || !operation.vendingRoute?.provider) {
        throw new Error("The requested service is not confirmed available.")
      }
      if (operation.vendStatus === "delivered") {
        return { operationReference: operation.reference, status: "delivered" }
      }

      const active = await repository.getActiveVendAttempt(operation.reference)
      if (active) return publicVend(active)
      const latest = typeof repository.getLatestVendAttempt === "function"
        ? await repository.getLatestVendAttempt(operation.reference)
        : null
      if (latest?.status === "delivered") {
        await repository.markDelivered({ operationReference: operation.reference, attemptId: latest.id })
        return publicVend(latest)
      }
      if (latest?.status === "failed") {
        return publicVend(await finishOrFallback(operation, latest))
      }

      const provider = providers.find((candidate) => candidate.name === operation.vendingRoute.provider)
      if (!provider?.enabled || typeof provider.vend !== "function") {
        throw new Error("The selected vending provider is not enabled.")
      }
      const attempt = await vendWith(operation, provider, operation.vendingRoute)
      return publicVend(await finishOrFallback(operation, attempt))
    },

    async reconcileVend(operationReference) {
      const operation = await repository.getOperation(operationReference)
      if (!operation) throw new Error("TopUp operation was not found.")
      if (operation.vendStatus === "delivered") {
        return { operationReference: operation.reference, status: "delivered" }
      }

      const attempt = await repository.getActiveVendAttempt(operation.reference)
      if (!attempt) throw new Error("No active vending attempt was found.")
      const provider = providers.find((candidate) => candidate.name === attempt.provider)
      if (!provider || typeof provider.requery !== "function") {
        throw new Error("The vending provider cannot be requeried.")
      }

      let result
      try {
        result = await provider.requery({ operation, attempt })
      } catch {
        result = { status: "unknown", definitive: false, failureCode: "PROVIDER_REQUERY_UNKNOWN" }
      }
      const updated = await repository.updateVendAttempt(attempt.id, result)
      if (updated.status === "delivered") {
        await repository.markDelivered({ operationReference: operation.reference, attemptId: attempt.id })
      }
      return publicVend(await finishOrFallback(operation, updated))
    },
  }
}
