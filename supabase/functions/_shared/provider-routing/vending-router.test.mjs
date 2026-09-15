import assert from "node:assert/strict"
import test from "node:test"

import { createVendingRouter } from "./vending-router.mjs"

function createMemoryRepository(operationOverrides = {}) {
  const operation = {
    id: "operation-1",
    reference: "CTU-20260915-000001",
    serviceType: "airtime",
    serviceCode: "mtn",
    customerIdentifier: "08031234567",
    amountMinor: 200_00,
    currency: "NGN",
    availabilityStatus: "unchecked",
    paymentStatus: "paid",
    vendStatus: "not_started",
    ...operationOverrides,
  }
  const attempts = []
  let deliveries = 0

  return {
    operation,
    attempts,
    get deliveries() {
      return deliveries
    },
    async getOperation(reference) {
      return reference === operation.reference ? operation : null
    },
    async saveAvailability({ status, route }) {
      operation.availabilityStatus = status
      operation.vendingRoute = route
      return operation
    },
    async getActiveVendAttempt() {
      return attempts.find((attempt) => ["processing", "pending", "unknown"].includes(attempt.status)) ?? null
    },
    async getLatestVendAttempt() {
      return attempts.at(-1) ?? null
    },
    async createVendAttempt(attempt) {
      attempts.push({ ...attempt })
      return attempts.at(-1)
    },
    async updateVendAttempt(id, patch) {
      const attempt = attempts.find((candidate) => candidate.id === id)
      Object.assign(attempt, patch)
      return attempt
    },
    async markDelivered() {
      if (operation.vendStatus !== "delivered") {
        operation.vendStatus = "delivered"
        deliveries += 1
      }
      return operation
    },
  }
}

test("availability checks VTpass first and does not call Monnify Bills when available", async () => {
  const calls = []
  const repository = createMemoryRepository()
  const router = createVendingRouter({
    repository,
    providers: [
      {
        name: "vtpass",
        enabled: true,
        async checkAvailability() {
          calls.push("vtpass")
          return { status: "available", productCode: "mtn" }
        },
      },
      {
        name: "monnify_bills",
        enabled: false,
        async checkAvailability() {
          calls.push("monnify_bills")
          return { status: "available" }
        },
      },
    ],
  })

  const result = await router.checkAvailability(repository.operation.reference)

  assert.equal(result.status, "available")
  assert.equal(result.provider, "vtpass")
  assert.deepEqual(calls, ["vtpass"])
  assert.equal(repository.operation.availabilityStatus, "available")
})

test("availability timeout remains unknown and does not route to a secondary vendor", async () => {
  const calls = []
  const repository = createMemoryRepository()
  const router = createVendingRouter({
    repository,
    providers: [
      {
        name: "vtpass",
        enabled: true,
        async checkAvailability() {
          calls.push("vtpass")
          throw new Error("timeout")
        },
      },
      {
        name: "monnify_bills",
        enabled: true,
        async checkAvailability() {
          calls.push("monnify_bills")
          return { status: "available" }
        },
      },
    ],
  })

  const result = await router.checkAvailability(repository.operation.reference)

  assert.equal(result.status, "unknown")
  assert.equal(result.provider, "vtpass")
  assert.deepEqual(calls, ["vtpass"])
  assert.equal(repository.operation.availabilityStatus, "unknown")
})

test("availability uses the secondary vendor only after definitive primary unavailability", async () => {
  const calls = []
  const repository = createMemoryRepository()
  const router = createVendingRouter({
    repository,
    providers: [
      {
        name: "vtpass",
        enabled: true,
        async checkAvailability() {
          calls.push("vtpass")
          return { status: "unavailable", definitive: true }
        },
      },
      {
        name: "monnify_bills",
        enabled: true,
        async checkAvailability() {
          calls.push("monnify_bills")
          return { status: "available", productCode: "AIRTIME-MTN" }
        },
      },
    ],
  })

  const result = await router.checkAvailability(repository.operation.reference)

  assert.equal(result.status, "available")
  assert.equal(result.provider, "monnify_bills")
  assert.deepEqual(calls, ["vtpass", "monnify_bills"])
})

test("vending cannot start before customer payment is confirmed", async () => {
  const repository = createMemoryRepository({
    availabilityStatus: "available",
    paymentStatus: "pending",
    vendingRoute: { provider: "vtpass", status: "available", productCode: "mtn" },
  })
  const router = createVendingRouter({
    repository,
    providers: [{
      name: "vtpass",
      enabled: true,
      async vend() {
        throw new Error("must not be called")
      },
    }],
  })

  await assert.rejects(
    router.vendPaidOperation(repository.operation.reference),
    /payment has not been confirmed/i,
  )
  assert.equal(repository.attempts.length, 0)
})

test("successful vending is delivered exactly once", async () => {
  let calls = 0
  const repository = createMemoryRepository({
    availabilityStatus: "available",
    vendingRoute: { provider: "vtpass", status: "available", productCode: "mtn" },
  })
  const router = createVendingRouter({
    repository,
    createId: () => "vend-1",
    providers: [{
      name: "vtpass",
      enabled: true,
      async vend() {
        calls += 1
        return { status: "delivered", providerTransactionReference: "VTP-001" }
      },
    }],
  })

  const first = await router.vendPaidOperation(repository.operation.reference)
  const second = await router.vendPaidOperation(repository.operation.reference)

  assert.equal(first.status, "delivered")
  assert.equal(second.status, "delivered")
  assert.equal(calls, 1)
  assert.equal(repository.deliveries, 1)
})

test("pending vending requeries VTpass and never starts Monnify Bills", async () => {
  const calls = []
  const repository = createMemoryRepository({
    availabilityStatus: "available",
    vendingRoute: { provider: "vtpass", status: "available", productCode: "mtn" },
  })
  repository.attempts.push({
    id: "vend-pending",
    operationReference: repository.operation.reference,
    provider: "vtpass",
    providerReference: "CTU-20260915-000001-VEND-1",
    status: "pending",
  })
  const router = createVendingRouter({
    repository,
    providers: [
      {
        name: "vtpass",
        enabled: true,
        async requery() {
          calls.push("vtpass:requery")
          return { status: "pending" }
        },
      },
      {
        name: "monnify_bills",
        enabled: true,
        async vend() {
          calls.push("monnify_bills:vend")
          return { status: "delivered" }
        },
      },
    ],
  })

  const result = await router.reconcileVend(repository.operation.reference)

  assert.equal(result.status, "pending")
  assert.equal(result.provider, "vtpass")
  assert.deepEqual(calls, ["vtpass:requery"])
  assert.equal(repository.attempts.length, 1)
})

test("vending uses Monnify Bills only after VTpass is definitively failed", async () => {
  const calls = []
  let sequence = 1
  const repository = createMemoryRepository({
    availabilityStatus: "available",
    vendingRoute: { provider: "vtpass", status: "available", productCode: "mtn" },
  })
  repository.attempts.push({
    id: "vend-1",
    operationReference: repository.operation.reference,
    provider: "vtpass",
    providerReference: "CTU-20260915-000001-VEND-1",
    status: "pending",
  })
  const router = createVendingRouter({
    repository,
    createId: () => `vend-${++sequence}`,
    providers: [
      {
        name: "vtpass",
        enabled: true,
        async requery() {
          calls.push("vtpass:requery")
          return { status: "failed", definitive: true, fulfillmentPossible: false }
        },
      },
      {
        name: "monnify_bills",
        enabled: true,
        async checkAvailability() {
          calls.push("monnify_bills:availability")
          return { status: "available", productCode: "AIRTIME-MTN" }
        },
        async vend() {
          calls.push("monnify_bills:vend")
          return { status: "delivered", providerTransactionReference: "MNB-001" }
        },
      },
    ],
  })

  const result = await router.reconcileVend(repository.operation.reference)

  assert.equal(result.status, "delivered")
  assert.equal(result.provider, "monnify_bills")
  assert.deepEqual(calls, ["vtpass:requery", "monnify_bills:availability", "monnify_bills:vend"])
  assert.equal(repository.attempts.length, 2)
  assert.equal(repository.deliveries, 1)
})

test("a concurrent vend claim never sends a second provider request", async () => {
  const repository = createMemoryRepository({
    availabilityStatus: "available",
    vendingRoute: { provider: "vtpass", status: "available", productCode: "mtn" },
  })
  repository.createVendAttempt = async () => ({
    id: "already-claimed",
    operationReference: repository.operation.reference,
    provider: "vtpass",
    providerReference: "existing-vtpass-request",
    status: "processing",
  })
  let vendCalls = 0
  const router = createVendingRouter({
    repository,
    createId: () => "losing-claim",
    providers: [{
      name: "vtpass",
      enabled: true,
      async vend() {
        vendCalls += 1
        return { status: "delivered" }
      },
    }],
  })

  const result = await router.vendPaidOperation(repository.operation.reference)

  assert.equal(result.attemptId, "already-claimed")
  assert.equal(vendCalls, 0)
})

test("vending restart continues after a stored definitive VTpass failure", async () => {
  const calls = []
  const repository = createMemoryRepository({
    availabilityStatus: "available",
    vendingRoute: { provider: "vtpass", status: "available", productCode: "mtn" },
  })
  repository.attempts.push({
    id: "failed-vtpass",
    operationReference: repository.operation.reference,
    provider: "vtpass",
    providerReference: "failed-reference",
    status: "failed",
    definitive: true,
    fulfillmentPossible: false,
  })
  const router = createVendingRouter({
    repository,
    createId: () => "monnify-bills-attempt",
    providers: [
      { name: "vtpass", enabled: true, async vend() { calls.push("vtpass:vend"); return { status: "delivered" } } },
      {
        name: "monnify_bills",
        enabled: true,
        async checkAvailability() { calls.push("monnify:availability"); return { status: "available" } },
        async vend() { calls.push("monnify:vend"); return { status: "delivered" } },
      },
    ],
  })

  const result = await router.vendPaidOperation(repository.operation.reference)

  assert.equal(result.provider, "monnify_bills")
  assert.deepEqual(calls, ["monnify:availability", "monnify:vend"])
})
