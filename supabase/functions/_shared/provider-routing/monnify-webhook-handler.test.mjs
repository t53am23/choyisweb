import assert from "node:assert/strict"
import test from "node:test"

import { createMonnifyWebhookHandler } from "./monnify-webhook-handler.mjs"
import { hmacSha512Hex } from "./webhook-security.mjs"

const rawBody = JSON.stringify({
  eventType: "SUCCESSFUL_TRANSACTION",
  eventData: {
    paymentReference: "CTU-20260915-PAY-1",
    transactionReference: "MNFY|123",
    amountPaid: 200,
  },
})

function repository(operation) {
  const events = []
  return {
    events,
    async getOperationByPaymentReference() { return operation },
    async recordProviderEvent(event) { events.push(event); return true },
    async updateProviderEventStatus(update) { events.push(update) },
  }
}

test("Sandbox webhook never trusts payload status and always requeries Monnify", async () => {
  const repo = repository({ reference: "CTU-20260915-ABC", paymentStatus: "pending" })
  let reconciled
  const handler = createMonnifyWebhookHandler({
    environment: { TOPUP_ROUTER_ENVIRONMENT: "sandbox" },
    repository: repo,
    paymentRouter: {
      async reconcilePayment(reference) {
        reconciled = reference
        return { status: "paid" }
      },
    },
  })

  const response = await handler(new Request("https://example.test/webhook", { method: "POST", body: rawBody }))

  assert.equal(response.status, 200)
  assert.equal(reconciled, "CTU-20260915-ABC")
  assert.deepEqual(repo.events[0].payload, {
    eventType: "SUCCESSFUL_TRANSACTION",
    paymentReference: "CTU-20260915-PAY-1",
    transactionReference: "MNFY|123",
  })
})

test("Live webhook rejects an invalid signature before database access", async () => {
  const repo = repository({ reference: "CTU-20260915-ABC", paymentStatus: "pending" })
  const handler = createMonnifyWebhookHandler({
    environment: {
      TOPUP_ROUTER_ENVIRONMENT: "live",
      TOPUP_MONNIFY_LIVE_SECRET_KEY: "live-secret",
    },
    repository: repo,
    paymentRouter: { async reconcilePayment() { throw new Error("must not run") } },
  })
  const response = await handler(new Request("https://example.test/webhook", {
    method: "POST",
    body: rawBody,
    headers: { "monnify-signature": "bad-signature" },
  }))

  assert.equal(response.status, 401)
  assert.equal(repo.events.length, 0)
})

test("Live webhook accepts the official HMAC-SHA512 raw-body signature then requeries", async () => {
  const secret = "live-secret"
  const signature = await hmacSha512Hex(secret, rawBody)
  const repo = repository({ reference: "CTU-20260915-ABC", paymentStatus: "pending" })
  let calls = 0
  const handler = createMonnifyWebhookHandler({
    environment: {
      TOPUP_ROUTER_ENVIRONMENT: "live",
      TOPUP_MONNIFY_LIVE_SECRET_KEY: secret,
    },
    repository: repo,
    paymentRouter: {
      async reconcilePayment() {
        calls += 1
        return { status: "paid" }
      },
    },
  })
  const response = await handler(new Request("https://example.test/webhook", {
    method: "POST",
    body: rawBody,
    headers: { "monnify-signature": signature },
  }))

  assert.equal(response.status, 200)
  assert.equal(calls, 1)
})
