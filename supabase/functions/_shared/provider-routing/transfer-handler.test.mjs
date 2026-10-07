import assert from "node:assert/strict"
import test from "node:test"

import { createTransferHandler } from "./transfer-handler.mjs"

const environment = {
  SUPABASE_URL: "https://project.supabase.co",
  SUPABASE_ANON_KEY: "public-anon-key",
  TOPUP_ROUTER_ENVIRONMENT: "sandbox",
  TOPUP_ALLOWED_ORIGINS: "http://127.0.0.1:3000",
}

function request(body) {
  return new Request("https://project.supabase.co/functions/v1/topup-transfer-router", {
    method: "POST",
    headers: {
      authorization: "Bearer user-token",
      "content-type": "application/json",
      origin: "http://127.0.0.1:3000",
    },
    body: JSON.stringify(body),
  })
}

const authenticate = async () => new Response(JSON.stringify({ id: "user-1", email: "buyer@example.com" }), {
  status: 200,
  headers: { "content-type": "application/json" },
})

test("transfer handler returns provider banks for an authenticated user", async () => {
  const handler = createTransferHandler({
    environment,
    transferProvider: { listBanks: async () => [{ code: "044", name: "Access Bank", type: "nuban" }] },
    fetchImpl: authenticate,
  })

  const response = await handler(request({ action: "banks" }))

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), {
    banks: [{ code: "044", name: "Access Bank", type: "nuban" }],
    provider: "paystack",
  })
})

test("transfer handler resolves an account but exposes no money-moving action", async () => {
  let input
  const handler = createTransferHandler({
    environment,
    transferProvider: {
      resolveAccount: async (value) => {
        input = value
        return { accountName: "ADE TEST USER", accountNumber: "0123456789", bankCode: "044" }
      },
    },
    fetchImpl: authenticate,
  })

  const response = await handler(request({ action: "resolve", accountNumber: "0123456789", bankCode: "044" }))

  assert.equal(response.status, 200)
  assert.deepEqual(input, { accountNumber: "0123456789", bankCode: "044" })
  assert.deepEqual(await response.json(), {
    account: { accountName: "ADE TEST USER", accountNumber: "0123456789", bankCode: "044" },
    provider: "paystack",
  })

  const blocked = await handler(request({ action: "send", amount: 1000 }))
  assert.equal(blocked.status, 400)
  assert.deepEqual(await blocked.json(), {
    code: "INVALID_ACTION",
    message: "Transfer action is invalid.",
  })
})
