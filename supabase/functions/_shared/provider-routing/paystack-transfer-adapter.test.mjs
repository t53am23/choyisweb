import assert from "node:assert/strict"
import test from "node:test"

import { createPaystackTransferAdapter } from "./paystack-transfer-adapter.mjs"

test("Paystack transfer adapter loads Nigerian banks from Paystack without leaking its key", async () => {
  const requests = []
  const adapter = createPaystackTransferAdapter({
    environment: "live",
    secretKey: "sk_live_SERVER_ONLY",
    fetchImpl: async (url, init = {}) => {
      requests.push({ url: String(url), init })
      return new Response(JSON.stringify({
        status: true,
        data: [
          { id: 9, name: "Access Bank", code: "044", active: true, country: "Nigeria", currency: "NGN", type: "nuban" },
          { id: 10, name: "Inactive Bank", code: "999", active: false, country: "Nigeria", currency: "NGN", type: "nuban" },
        ],
      }), { status: 200, headers: { "content-type": "application/json" } })
    },
  })

  const banks = await adapter.listBanks()

  assert.equal(requests[0].url, "https://api.paystack.co/bank?country=nigeria&currency=NGN&perPage=100")
  assert.equal(requests[0].init.headers.authorization, "Bearer sk_live_SERVER_ONLY")
  assert.deepEqual(banks, [{ code: "044", name: "Access Bank", type: "nuban" }])
  assert.equal(JSON.stringify(banks).includes("sk_live_SERVER_ONLY"), false)
})

test("Paystack transfer adapter resolves an account through Paystack", async () => {
  const requests = []
  const adapter = createPaystackTransferAdapter({
    environment: "sandbox",
    secretKey: "sk_test_SERVER_ONLY",
    fetchImpl: async (url, init = {}) => {
      requests.push({ url: String(url), init })
      return new Response(JSON.stringify({
        status: true,
        data: { account_number: "0123456789", account_name: "ADE TEST USER" },
      }), { status: 200, headers: { "content-type": "application/json" } })
    },
  })

  const account = await adapter.resolveAccount({ accountNumber: "0123456789", bankCode: "044" })

  assert.equal(requests[0].url, "https://api.paystack.co/bank/resolve?account_number=0123456789&bank_code=044")
  assert.deepEqual(account, {
    accountName: "ADE TEST USER",
    accountNumber: "0123456789",
    bankCode: "044",
  })
})

test("Paystack transfer adapter rejects malformed recipient details before calling Paystack", async () => {
  let called = false
  const adapter = createPaystackTransferAdapter({
    environment: "sandbox",
    secretKey: "sk_test_SERVER_ONLY",
    fetchImpl: async () => {
      called = true
      throw new Error("should not be called")
    },
  })

  await assert.rejects(
    () => adapter.resolveAccount({ accountNumber: "1234", bankCode: "044" }),
    /10-digit Nigerian account number/,
  )
  assert.equal(called, false)
})
