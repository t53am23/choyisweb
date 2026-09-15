import assert from "node:assert/strict"
import test from "node:test"

import { createVendingWorkerHandler } from "./vending-worker-handler.mjs"

test("vending worker requeries active attempts and reschedules unknown results", async () => {
  const updates = []
  let starts = 0
  let requeries = 0
  const handler = createVendingWorkerHandler({
    environment: { TOPUP_INTERNAL_ROUTER_KEY: "internal-test-key" },
    repository: {
      async claimVendJobs() { return [{ reference: "CTU-1" }] },
      async getActiveVendAttempt() { return { id: "vend-1", status: "pending" } },
      async updateVendJob(update) { updates.push(update) },
    },
    vendingRouter: {
      async vendPaidOperation() { starts += 1; return { status: "delivered" } },
      async reconcileVend() { requeries += 1; return { status: "unknown" } },
    },
  })
  const response = await handler(new Request("https://example.test/worker", {
    method: "POST",
    headers: { "content-type": "application/json", "x-topup-router-key": "internal-test-key" },
    body: JSON.stringify({ limit: 10 }),
  }))
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(starts, 0)
  assert.equal(requeries, 1)
  assert.equal(payload.outcomes[0].status, "unknown")
  assert.deepEqual(updates[0], { operationReference: "CTU-1", status: "pending", delaySeconds: 30 })
})
