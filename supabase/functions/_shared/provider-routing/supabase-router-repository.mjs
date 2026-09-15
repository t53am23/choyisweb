function requireText(value, name) {
  const text = String(value ?? "").trim()
  if (!text) throw new Error(`${name} is required.`)
  return text
}

function firstRow(value) {
  return Array.isArray(value) ? value[0] ?? null : value
}

function mapOperation(row) {
  if (!row) return null
  return {
    id: row.id,
    reference: row.reference,
    idempotencyKey: row.idempotency_key,
    userId: row.user_id,
    serviceType: row.service_type,
    serviceCode: row.service_code,
    variationCode: row.variation_code,
    customerIdentifier: row.customer_identifier,
    phone: row.phone,
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    amountMinor: Number(row.amount_minor),
    currency: row.currency,
    availabilityStatus: row.availability_status,
    vendingRoute: row.availability_route,
    paymentStatus: row.payment_status,
    vendStatus: row.vend_status,
  }
}

function mapPaymentAttempt(row) {
  if (!row) return null
  return {
    id: row.id,
    operationId: row.operation_id,
    operationReference: row.topup_operations?.reference ?? row.operation_reference,
    provider: row.provider,
    providerReference: row.provider_reference,
    providerTransactionReference: row.provider_transaction_reference,
    expectedAmountMinor: Number(row.expected_amount_minor),
    amountPaidMinor: row.amount_paid_minor === null ? null : Number(row.amount_paid_minor),
    currency: row.currency,
    status: row.status,
    definitive: row.definitive,
    chargePossible: row.charge_possible,
    paymentMethod: row.payment_method,
    failureCode: row.failure_code,
    checkout: row.checkout_snapshot,
  }
}

function mapVendAttempt(row) {
  if (!row) return null
  return {
    id: row.id,
    operationId: row.operation_id,
    operationReference: row.topup_operations?.reference ?? row.operation_reference,
    provider: row.provider,
    providerReference: row.provider_reference,
    providerTransactionReference: row.provider_transaction_reference,
    status: row.status,
    definitive: row.definitive,
    fulfillmentPossible: row.fulfillment_possible,
    failureCode: row.failure_code,
    responseCode: row.response_code,
    responseDescription: row.response_description,
    purchasedCode: row.purchased_code,
  }
}

function paymentPatch(patch) {
  return {
    ...(patch.status === undefined ? {} : { status: patch.status }),
    ...(patch.definitive === undefined ? {} : { definitive: patch.definitive }),
    ...(patch.chargePossible === undefined ? {} : { charge_possible: patch.chargePossible }),
    ...(patch.providerTransactionReference === undefined ? {} : { provider_transaction_reference: patch.providerTransactionReference }),
    ...(patch.amountPaidMinor === undefined ? {} : { amount_paid_minor: patch.amountPaidMinor }),
    ...(patch.currency === undefined ? {} : { currency: patch.currency }),
    ...(patch.paymentMethod === undefined ? {} : { payment_method: patch.paymentMethod }),
    ...(patch.failureCode === undefined ? {} : { failure_code: patch.failureCode }),
    ...(patch.checkout === undefined ? {} : { checkout_snapshot: patch.checkout }),
    ...(patch.responseSnapshot === undefined ? {} : { response_snapshot: patch.responseSnapshot }),
    updated_at: new Date().toISOString(),
  }
}

function vendPatch(patch) {
  return {
    ...(patch.status === undefined ? {} : { status: patch.status }),
    ...(patch.definitive === undefined ? {} : { definitive: patch.definitive }),
    ...(patch.fulfillmentPossible === undefined ? {} : { fulfillment_possible: patch.fulfillmentPossible }),
    ...(patch.providerTransactionReference === undefined ? {} : { provider_transaction_reference: patch.providerTransactionReference }),
    ...(patch.failureCode === undefined ? {} : { failure_code: patch.failureCode }),
    ...(patch.responseCode === undefined ? {} : { response_code: patch.responseCode }),
    ...(patch.responseDescription === undefined ? {} : { response_description: patch.responseDescription }),
    ...(patch.purchasedCode === undefined ? {} : { purchased_code: patch.purchasedCode }),
    ...(patch.responseSnapshot === undefined ? {} : { response_snapshot: patch.responseSnapshot }),
    updated_at: new Date().toISOString(),
  }
}

export function createSupabaseRouterRepository({ supabaseUrl, serviceRoleKey, fetchImpl = fetch }) {
  const baseUrl = requireText(supabaseUrl, "Supabase URL").replace(/\/$/, "")
  const privateServiceRoleKey = requireText(serviceRoleKey, "Supabase service role key")
  const baseHeaders = {
    apikey: privateServiceRoleKey,
    authorization: `Bearer ${privateServiceRoleKey}`,
    "content-type": "application/json",
  }

  async function request(path, { method = "GET", body, prefer } = {}) {
    const response = await fetchImpl(`${baseUrl}/rest/v1/${path}`, {
      method,
      headers: { ...baseHeaders, ...(prefer ? { prefer } : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })
    if (response.status === 204) return null
    const payload = await response.json().catch(() => null)
    if (!response.ok) throw new Error(`TopUp persistence failed (${response.status}).`)
    return payload
  }

  async function getOperation(reference) {
    return mapOperation(firstRow(await request(
      `topup_operations?reference=eq.${encodeURIComponent(reference)}&limit=1`,
    )))
  }

  async function getActivePaymentAttempt(operationReference) {
    return mapPaymentAttempt(firstRow(await request(
      `topup_payment_attempts?topup_operations.reference=eq.${encodeURIComponent(operationReference)}`
        + "&status=in.(initializing,ready,pending,unknown)"
        + "&select=*,topup_operations!inner(reference)&order=created_at.desc&limit=1",
    )))
  }

  async function getLatestPaymentAttempt(operationReference) {
    return mapPaymentAttempt(firstRow(await request(
      `topup_payment_attempts?topup_operations.reference=eq.${encodeURIComponent(operationReference)}`
        + "&select=*,topup_operations!inner(reference)&order=created_at.desc&limit=1",
    )))
  }

  async function getActiveVendAttempt(operationReference) {
    return mapVendAttempt(firstRow(await request(
      `topup_vend_attempts?topup_operations.reference=eq.${encodeURIComponent(operationReference)}`
        + "&status=in.(processing,pending,unknown)"
        + "&select=*,topup_operations!inner(reference)&order=created_at.desc&limit=1",
    )))
  }

  async function getLatestVendAttempt(operationReference) {
    return mapVendAttempt(firstRow(await request(
      `topup_vend_attempts?topup_operations.reference=eq.${encodeURIComponent(operationReference)}`
        + "&select=*,topup_operations!inner(reference)&order=created_at.desc&limit=1",
    )))
  }

  return {
    async createOperation(input) {
      const existing = firstRow(await request(
        `topup_operations?user_id=eq.${encodeURIComponent(input.userId)}`
          + `&idempotency_key=eq.${encodeURIComponent(input.idempotencyKey)}&limit=1`,
      ))
      if (existing) {
        const sameIntent = existing.service_type === input.serviceType
          && existing.service_code === input.serviceCode
          && existing.variation_code === (input.variationCode ?? null)
          && existing.customer_identifier === input.customerIdentifier
          && Number(existing.amount_minor) === input.amountMinor
        if (!sameIntent) throw new Error("Idempotency key was already used for a different TopUp request.")
        return mapOperation(existing)
      }

      const inserted = firstRow(await request("topup_operations?on_conflict=user_id,idempotency_key", {
        method: "POST",
        prefer: "resolution=ignore-duplicates,return=representation",
        body: {
          reference: input.reference,
          idempotency_key: input.idempotencyKey,
          user_id: input.userId,
          service_type: input.serviceType,
          service_code: input.serviceCode,
          variation_code: input.variationCode ?? null,
          customer_identifier: input.customerIdentifier,
          phone: input.phone,
          customer_email: input.customerEmail,
          customer_name: input.customerName ?? null,
          amount_minor: input.amountMinor,
          currency: input.currency,
        },
      }))
      if (inserted) return mapOperation(inserted)

      const concurrentlyInserted = firstRow(await request(
        `topup_operations?user_id=eq.${encodeURIComponent(input.userId)}`
          + `&idempotency_key=eq.${encodeURIComponent(input.idempotencyKey)}&limit=1`,
      ))
      if (!concurrentlyInserted) throw new Error("TopUp operation could not be created.")
      const sameIntent = concurrentlyInserted.service_type === input.serviceType
        && concurrentlyInserted.service_code === input.serviceCode
        && concurrentlyInserted.variation_code === (input.variationCode ?? null)
        && concurrentlyInserted.customer_identifier === input.customerIdentifier
        && Number(concurrentlyInserted.amount_minor) === input.amountMinor
      if (!sameIntent) throw new Error("Idempotency key was already used for a different TopUp request.")
      return mapOperation(concurrentlyInserted)
    },

    getOperation,

    async getOperationByPaymentReference(providerReference) {
      const attempt = firstRow(await request(
        `topup_payment_attempts?provider_reference=eq.${encodeURIComponent(providerReference)}`
          + "&select=*,topup_operations(*)&limit=1",
      ))
      return attempt?.topup_operations ? mapOperation(attempt.topup_operations) : null
    },

    async saveAvailability({ operationReference, status, route }) {
      return mapOperation(firstRow(await request(
        `topup_operations?reference=eq.${encodeURIComponent(operationReference)}`,
        {
          method: "PATCH",
          prefer: "return=representation",
          body: { availability_status: status, availability_route: route, updated_at: new Date().toISOString() },
        },
      )))
    },

    getActivePaymentAttempt,
    getLatestPaymentAttempt,

    async createPaymentAttempt(attempt) {
      const operation = await getOperation(attempt.operationReference)
      if (!operation) throw new Error("TopUp operation was not found.")
      const inserted = firstRow(await request("topup_payment_attempts", {
        method: "POST",
        prefer: "resolution=ignore-duplicates,return=representation",
        body: {
          id: attempt.id,
          operation_id: operation.id,
          provider: attempt.provider,
          provider_reference: attempt.providerReference,
          expected_amount_minor: attempt.expectedAmountMinor,
          currency: attempt.currency,
          status: attempt.status,
        },
      }))
      if (!inserted) {
        const active = await getActivePaymentAttempt(attempt.operationReference)
        if (!active) throw new Error("Payment attempt could not be claimed.")
        return active
      }
      await request(`topup_operations?id=eq.${encodeURIComponent(operation.id)}`, {
        method: "PATCH",
        body: { payment_status: "pending", updated_at: new Date().toISOString() },
      })
      return { ...mapPaymentAttempt(inserted), operationReference: operation.reference }
    },

    async updatePaymentAttempt(id, patch) {
      return mapPaymentAttempt(firstRow(await request(
        `topup_payment_attempts?id=eq.${encodeURIComponent(id)}`,
        { method: "PATCH", prefer: "return=representation", body: paymentPatch(patch) },
      )))
    },

    async markPaymentPaid({ operationReference, attemptId }) {
      return mapOperation(firstRow(await request("rpc/topup_mark_payment_paid", {
        method: "POST",
        body: { p_operation_reference: operationReference, p_attempt_id: attemptId },
      })))
    },

    getActiveVendAttempt,
    getLatestVendAttempt,

    async createVendAttempt(attempt) {
      const operation = await getOperation(attempt.operationReference)
      if (!operation) throw new Error("TopUp operation was not found.")
      const inserted = firstRow(await request("topup_vend_attempts", {
        method: "POST",
        prefer: "resolution=ignore-duplicates,return=representation",
        body: {
          id: attempt.id,
          operation_id: operation.id,
          provider: attempt.provider,
          provider_reference: attempt.providerReference,
          status: attempt.status,
        },
      }))
      if (!inserted) {
        const active = await getActiveVendAttempt(attempt.operationReference)
        if (!active) throw new Error("Vending attempt could not be claimed.")
        return active
      }
      await request(`topup_operations?id=eq.${encodeURIComponent(operation.id)}`, {
        method: "PATCH",
        body: { vend_status: "processing", updated_at: new Date().toISOString() },
      })
      return { ...mapVendAttempt(inserted), operationReference: operation.reference }
    },

    async updateVendAttempt(id, patch) {
      return mapVendAttempt(firstRow(await request(
        `topup_vend_attempts?id=eq.${encodeURIComponent(id)}`,
        { method: "PATCH", prefer: "return=representation", body: vendPatch(patch) },
      )))
    },

    async markDelivered({ operationReference, attemptId }) {
      return mapOperation(firstRow(await request("rpc/topup_mark_vend_delivered", {
        method: "POST",
        body: { p_operation_reference: operationReference, p_attempt_id: attemptId },
      })))
    },

    async recordProviderEvent({ provider, eventKey, operationReference, bodyHash, payload }) {
      const inserted = await request("topup_provider_events?on_conflict=provider,event_key", {
        method: "POST",
        prefer: "resolution=ignore-duplicates,return=representation",
        body: {
          provider,
          event_key: eventKey,
          operation_reference: operationReference ?? null,
          body_hash: bodyHash,
          payload,
        },
      })
      return Array.isArray(inserted) && inserted.length > 0
    },

    async updateProviderEventStatus({ provider, eventKey, status }) {
      await request(
        `topup_provider_events?provider=eq.${encodeURIComponent(provider)}`
          + `&event_key=eq.${encodeURIComponent(eventKey)}`,
        {
          method: "PATCH",
          body: {
            status,
            processed_at: status === "received" ? null : new Date().toISOString(),
          },
        },
      )
    },

    async claimVendJobs(limit = 10) {
      const rows = await request("rpc/topup_claim_vend_jobs", {
        method: "POST",
        body: { p_limit: limit },
      })
      return Array.isArray(rows) ? rows.map(mapOperation) : []
    },

    async updateVendJob({ operationReference, status, errorCode = null, delaySeconds = 30 }) {
      await request("rpc/topup_update_vend_job", {
        method: "POST",
        body: {
          p_operation_reference: operationReference,
          p_status: status,
          p_error_code: errorCode,
          p_delay_seconds: delaySeconds,
        },
      })
    },
  }
}
