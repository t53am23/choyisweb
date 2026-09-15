import assert from "node:assert/strict"
import test from "node:test"

import { createPaymentHandler } from "./payment-handler.mjs"
import { createVendingHandler } from "./vending-handler.mjs"

const environment = {
  TOPUP_ROUTER_ENVIRONMENT: "sandbox",
  TOPUP_INTERNAL_ROUTER_KEY: "internal-test-key",
  SUPABASE_URL: "https://project.supabase.co",
  SUPABASE_ANON_KEY: "anon-key",
}

function authenticatedFetch() {
  return Promise.resolve(new Response(JSON.stringify({
    id: "user-1",
    email: "customer@example.com",
    user_metadata: { full_name: "Test Customer" },
  }), { status: 200, headers: { "content-type": "application/json" } }))
}

function post(body, headers = {}) {
  return new Request("https://project.supabase.co/functions/v1/test", {
    method: "POST",
    headers: {
      authorization: "Bearer user-token",
      "content-type": "application/json",
      origin: "http://127.0.0.1:3000",
      ...headers,
    },
    body: JSON.stringify(body),
  })
}

test("prepare derives customer identity from auth and checks vending availability before payment", async () => {
  let storedInput
  let availabilityCalls = 0
  const stored = {
    id: "operation-1",
    reference: "CTU-20260915-ABC",
    userId: "user-1",
    availabilityStatus: "unchecked",
    paymentStatus: "unpaid",
    vendStatus: "not_started",
  }
  const repository = {
    async createOperation(input) {
      storedInput = input
      return stored
    },
    async getOperation() {
      return { ...stored, availabilityStatus: "available", vendingRoute: { provider: "vtpass" } }
    },
  }
  const handler = createVendingHandler({
    environment,
    repository,
    fetchImpl: authenticatedFetch,
    vendingRouter: {
      async checkAvailability(reference) {
        availabilityCalls += 1
        assert.equal(reference, stored.reference)
        return { provider: "vtpass", status: "available" }
      },
    },
  })

  const response = await handler(post({
    action: "prepare",
    service_type: "airtime",
    service_code: "mtn",
    phone: "08031234567",
    amount_minor: 20_000,
    idempotency_key: "idempotency-key-0001",
    customerEmail: "attacker@example.com",
  }))
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(availabilityCalls, 1)
  assert.equal(storedInput.customerEmail, "customer@example.com")
  assert.equal(storedInput.userId, "user-1")
  assert.equal(storedInput.amountMinor, 20_000)
  assert.equal(payload.availability.status, "available")
  assert.equal(payload.paymentStatus, "unpaid")
})

test("payment endpoint verifies ownership before starting checkout", async () => {
  let starts = 0
  const handler = createPaymentHandler({
    environment,
    fetchImpl: authenticatedFetch,
    repository: {
      async getOperation() {
        return { reference: "CTU-20260915-ABC", userId: "another-user" }
      },
    },
    paymentRouter: {
      async startPayment() {
        starts += 1
        return { status: "ready" }
      },
    },
  })

  const response = await handler(post({ action: "start", operation_reference: "CTU-20260915-ABC" }))

  assert.equal(response.status, 404)
  assert.equal(starts, 0)
})

test("vending process is inaccessible without the internal router key", async () => {
  let vendCalls = 0
  const handler = createVendingHandler({
    environment,
    repository: { async getActiveVendAttempt() { return null } },
    vendingRouter: {
      async vendPaidOperation() {
        vendCalls += 1
        return { status: "delivered" }
      },
    },
    fetchImpl: authenticatedFetch,
  })

  const response = await handler(post({
    action: "process",
    operation_reference: "CTU-20260915-ABC",
  }))

  assert.equal(response.status, 401)
  assert.equal(vendCalls, 0)
})
