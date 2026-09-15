import assert from "node:assert/strict"
import test from "node:test"

import { createPaymentRouter } from "./payment-router.mjs"

function createMemoryRepository(operationOverrides = {}) {
  const operation = {
    id: "operation-1",
    reference: "CTU-20260915-000001",
    amountMinor: 200_00,
    currency: "NGN",
    availabilityStatus: "available",
    paymentStatus: "unpaid",
    ...operationOverrides,
  }
  const attempts = []
  let vendingJobs = 0

  return {
    operation,
    attempts,
    get vendingJobs() {
      return vendingJobs
    },
    async getOperation(reference) {
      return reference === operation.reference ? operation : null
    },
    async getActivePaymentAttempt() {
      return attempts.find((attempt) => ["ready", "pending", "unknown"].includes(attempt.status)) ?? null
    },
    async getLatestPaymentAttempt() {
      return attempts.at(-1) ?? null
    },
    async createPaymentAttempt(attempt) {
      attempts.push({ ...attempt })
      return attempts.at(-1)
    },
    async updatePaymentAttempt(id, patch) {
      const attempt = attempts.find((candidate) => candidate.id === id)
      Object.assign(attempt, patch)
      return attempt
    },
    async markPaymentPaid() {
      if (operation.paymentStatus !== "paid") {
        operation.paymentStatus = "paid"
        vendingJobs += 1
      }
      return operation
    },
  }
}

test("payment starts with Monnify and does not call lower-priority providers", async () => {
  const calls = []
  const repository = createMemoryRepository()
  const router = createPaymentRouter({
    repository,
    createId: () => "attempt-1",
    providers: [
      {
        name: "monnify",
        enabled: true,
        async initialize() {
          calls.push("monnify")
          return { status: "ready", checkout: { apiKey: "public-test-key", contractCode: "test-contract" } }
        },
      },
      {
        name: "opay",
        enabled: false,
        async initialize() {
          calls.push("opay")
          return { status: "ready" }
        },
      },
      {
        name: "paystack",
        enabled: true,
        async initialize() {
          calls.push("paystack")
          return { status: "ready" }
        },
      },
    ],
  })

  const result = await router.startPayment(repository.operation.reference)

  assert.equal(result.status, "ready")
  assert.equal(result.provider, "monnify")
  assert.deepEqual(calls, ["monnify"])
  assert.equal(repository.attempts.length, 1)
  assert.equal(repository.attempts[0].operationReference, repository.operation.reference)
})

test("payment falls back only after a definitive technical initialization failure", async () => {
  const calls = []
  let sequence = 0
  const repository = createMemoryRepository()
  const router = createPaymentRouter({
    repository,
    createId: () => `attempt-${++sequence}`,
    providers: [
      {
        name: "monnify",
        enabled: true,
        async initialize() {
          calls.push("monnify")
          return { status: "technical_failure", definitive: true, chargePossible: false }
        },
      },
      {
        name: "opay",
        enabled: false,
        async initialize() {
          calls.push("opay")
          return { status: "ready" }
        },
      },
      {
        name: "paystack",
        enabled: true,
        async initialize() {
          calls.push("paystack")
          return { status: "ready", checkout: { authorizationUrl: "https://checkout.example" } }
        },
      },
    ],
  })

  const result = await router.startPayment(repository.operation.reference)

  assert.equal(result.status, "ready")
  assert.equal(result.provider, "paystack")
  assert.deepEqual(calls, ["monnify", "paystack"])
  assert.deepEqual(repository.attempts.map((attempt) => attempt.status), ["technical_failure", "ready"])
})

test("payment does not fall back when Monnify initialization is pending", async () => {
  const calls = []
  const repository = createMemoryRepository()
  const router = createPaymentRouter({
    repository,
    createId: () => "attempt-pending",
    providers: [
      {
        name: "monnify",
        enabled: true,
        async initialize() {
          calls.push("monnify")
          return { status: "pending" }
        },
      },
      {
        name: "paystack",
        enabled: true,
        async initialize() {
          calls.push("paystack")
          return { status: "ready" }
        },
      },
    ],
  })

  const result = await router.startPayment(repository.operation.reference)

  assert.equal(result.status, "pending")
  assert.equal(result.provider, "monnify")
  assert.deepEqual(calls, ["monnify"])
})

test("payment records an initialization timeout as unknown and does not fall back", async () => {
  const calls = []
  const repository = createMemoryRepository()
  const router = createPaymentRouter({
    repository,
    createId: () => "attempt-timeout",
    providers: [
      {
        name: "monnify",
        enabled: true,
        async initialize() {
          calls.push("monnify")
          throw new Error("request timed out")
        },
      },
      {
        name: "paystack",
        enabled: true,
        async initialize() {
          calls.push("paystack")
          return { status: "ready" }
        },
      },
    ],
  })

  const result = await router.startPayment(repository.operation.reference)

  assert.equal(result.status, "unknown")
  assert.equal(result.provider, "monnify")
  assert.deepEqual(calls, ["monnify"])
  assert.equal(repository.attempts[0].failureCode, "PROVIDER_INIT_UNKNOWN")
})

test("payment reconciliation marks paid and queues vending exactly once after exact verification", async () => {
  const repository = createMemoryRepository()
  repository.attempts.push({
    id: "attempt-paid",
    operationReference: repository.operation.reference,
    provider: "monnify",
    providerReference: "CTU-20260915-000001-PAY-1",
    expectedAmountMinor: 200_00,
    currency: "NGN",
    status: "pending",
  })
  const monnify = {
    name: "monnify",
    enabled: true,
    async verify() {
      return {
        status: "paid",
        providerReference: "CTU-20260915-000001-PAY-1",
        amountPaidMinor: 200_00,
        currency: "NGN",
        providerTransactionReference: "MNFY|01",
      }
    },
  }
  const router = createPaymentRouter({ repository, providers: [monnify] })

  const first = await router.reconcilePayment(repository.operation.reference)
  const second = await router.reconcilePayment(repository.operation.reference)

  assert.equal(first.status, "paid")
  assert.equal(second.status, "paid")
  assert.equal(repository.operation.paymentStatus, "paid")
  assert.equal(repository.vendingJobs, 1)
})

test("payment reconciliation refuses a paid response with the wrong amount", async () => {
  const repository = createMemoryRepository()
  repository.attempts.push({
    id: "attempt-mismatch",
    operationReference: repository.operation.reference,
    provider: "monnify",
    providerReference: "CTU-20260915-000001-PAY-2",
    expectedAmountMinor: 200_00,
    currency: "NGN",
    status: "pending",
  })
  const router = createPaymentRouter({
    repository,
    providers: [{
      name: "monnify",
      enabled: true,
      async verify() {
        return {
          status: "paid",
          providerReference: "CTU-20260915-000001-PAY-2",
          amountPaidMinor: 199_00,
          currency: "NGN",
        }
      },
    }],
  })

  const result = await router.reconcilePayment(repository.operation.reference)

  assert.equal(result.status, "amount_mismatch")
  assert.equal(repository.operation.paymentStatus, "unpaid")
  assert.equal(repository.vendingJobs, 0)
})

test("payment reconciliation falls back only after the same provider proves a non-charge technical failure", async () => {
  const calls = []
  let sequence = 0
  const repository = createMemoryRepository()
  repository.attempts.push({
    id: "attempt-monnify",
    operationReference: repository.operation.reference,
    provider: "monnify",
    providerReference: "CTU-20260915-000001-PAY-MONNIFY",
    expectedAmountMinor: 200_00,
    currency: "NGN",
    status: "unknown",
  })
  const router = createPaymentRouter({
    repository,
    createId: () => `attempt-${++sequence}`,
    providers: [
      {
        name: "monnify",
        enabled: true,
        async verify() {
          calls.push("verify-monnify")
          return { status: "technical_failure", definitive: true, chargePossible: false }
        },
      },
      {
        name: "paystack",
        enabled: true,
        async initialize() {
          calls.push("initialize-paystack")
          return { status: "ready", checkout: { authorizationUrl: "https://checkout.example" } }
        },
      },
    ],
  })

  const result = await router.reconcilePayment(repository.operation.reference)

  assert.equal(result.status, "ready")
  assert.equal(result.provider, "paystack")
  assert.deepEqual(calls, ["verify-monnify", "initialize-paystack"])
})

test("payment reconciliation keeps pending and unknown results on the same provider", async () => {
  for (const verifiedStatus of ["pending", "unknown"]) {
    const calls = []
    const repository = createMemoryRepository()
    repository.attempts.push({
      id: `attempt-${verifiedStatus}`,
      operationReference: repository.operation.reference,
      provider: "monnify",
      providerReference: `CTU-20260915-000001-PAY-${verifiedStatus}`,
      expectedAmountMinor: 200_00,
      currency: "NGN",
      status: "unknown",
    })
    const router = createPaymentRouter({
      repository,
      providers: [
        {
          name: "monnify",
          enabled: true,
          async verify() {
            calls.push("verify-monnify")
            return { status: verifiedStatus }
          },
        },
        {
          name: "paystack",
          enabled: true,
          async initialize() {
            calls.push("initialize-paystack")
            return { status: "ready" }
          },
        },
      ],
    })

    const result = await router.reconcilePayment(repository.operation.reference)

    assert.equal(result.status, verifiedStatus)
    assert.equal(result.provider, "monnify")
    assert.deepEqual(calls, ["verify-monnify"])
  }
})

test("a concurrent payment claim reuses the stored attempt without initializing again", async () => {
  const repository = createMemoryRepository()
  repository.createPaymentAttempt = async () => ({
    id: "already-claimed",
    operationReference: repository.operation.reference,
    provider: "monnify",
    providerReference: "existing-reference",
    expectedAmountMinor: 200_00,
    currency: "NGN",
    status: "ready",
    checkout: { reference: "existing-reference" },
  })
  let initializeCalls = 0
  const router = createPaymentRouter({
    repository,
    createId: () => "losing-claim",
    providers: [{
      name: "monnify",
      enabled: true,
      async initialize() {
        initializeCalls += 1
        return { status: "ready" }
      },
    }],
  })

  const result = await router.startPayment(repository.operation.reference)

  assert.equal(result.attemptId, "already-claimed")
  assert.equal(initializeCalls, 0)
})

test("payment restart continues after a stored definitive technical failure", async () => {
  const calls = []
  const repository = createMemoryRepository()
  repository.attempts.push({
    id: "failed-monnify",
    operationReference: repository.operation.reference,
    provider: "monnify",
    providerReference: "failed-reference",
    status: "technical_failure",
    definitive: true,
    chargePossible: false,
  })
  const router = createPaymentRouter({
    repository,
    createId: () => "paystack-attempt",
    providers: [
      { name: "monnify", enabled: true, async initialize() { calls.push("monnify"); return { status: "ready" } } },
      { name: "paystack", enabled: true, async initialize() { calls.push("paystack"); return { status: "ready" } } },
    ],
  })

  const result = await router.startPayment(repository.operation.reference)

  assert.equal(result.provider, "paystack")
  assert.deepEqual(calls, ["paystack"])
})
