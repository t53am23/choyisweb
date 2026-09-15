import assert from "node:assert/strict"
import test from "node:test"

import { createMonnifyPaymentAdapter } from "./monnify-payment-adapter.mjs"

test("Monnify Sandbox checkout exposes only public SDK configuration", async () => {
  const adapter = createMonnifyPaymentAdapter({
    environment: "sandbox",
    apiKey: "MK_TEST_PUBLIC",
    secretKey: "SECRET_MUST_STAY_SERVER_SIDE",
    contractCode: "TEST_CONTRACT",
    fetchImpl: async () => {
      throw new Error("checkout initialization must not use the API-first flow")
    },
  })
  const operation = {
    reference: "CTU-20260915-000001",
    amountMinor: 200_00,
    currency: "NGN",
    customerEmail: "buyer@example.com",
    customerName: "Test Buyer",
  }
  const attempt = {
    providerReference: "CTU-20260915-000001-PAY-1",
  }

  const result = await adapter.initialize({ operation, attempt })

  assert.equal(result.status, "ready")
  assert.equal(result.checkout.provider, "monnify")
  assert.equal(result.checkout.environment, "sandbox")
  assert.equal(result.checkout.reference, attempt.providerReference)
  assert.equal(result.checkout.amount, 200)
  assert.equal(result.checkout.apiKey, "MK_TEST_PUBLIC")
  assert.equal(result.checkout.contractCode, "TEST_CONTRACT")
  assert.equal(JSON.stringify(result).includes("SECRET_MUST_STAY_SERVER_SIDE"), false)
})

test("Monnify Sandbox verification authenticates server-side and maps PAID", async () => {
  const requests = []
  const responses = [
    {
      requestSuccessful: true,
      responseBody: { accessToken: "sandbox-access-token", expiresIn: 3600 },
    },
    {
      requestSuccessful: true,
      responseBody: {
        paymentReference: "CTU-20260915-000001-PAY-1",
        transactionReference: "MNFY|20260915|000001",
        paymentStatus: "PAID",
        amountPaid: 200,
        currencyCode: "NGN",
        paymentMethod: "CARD",
      },
    },
  ]
  const adapter = createMonnifyPaymentAdapter({
    environment: "sandbox",
    apiKey: "MK_TEST_PUBLIC",
    secretKey: "SECRET_MUST_STAY_SERVER_SIDE",
    contractCode: "TEST_CONTRACT",
    fetchImpl: async (url, init = {}) => {
      requests.push({ url: String(url), init })
      return new Response(JSON.stringify(responses.shift()), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    },
  })

  const result = await adapter.verify({
    operation: { reference: "CTU-20260915-000001" },
    attempt: { providerReference: "CTU-20260915-000001-PAY-1" },
  })

  assert.equal(requests[0].url, "https://sandbox.monnify.com/api/v1/auth/login")
  assert.match(requests[0].init.headers.authorization, /^Basic /)
  assert.equal(
    requests[1].url,
    "https://sandbox.monnify.com/api/v2/merchant/transactions/query?paymentReference=CTU-20260915-000001-PAY-1",
  )
  assert.equal(requests[1].init.headers.authorization, "Bearer sandbox-access-token")
  assert.deepEqual(result, {
    status: "paid",
    providerReference: "CTU-20260915-000001-PAY-1",
    providerTransactionReference: "MNFY|20260915|000001",
    amountPaidMinor: 200_00,
    currency: "NGN",
    paymentMethod: "CARD",
  })
  assert.equal(JSON.stringify(result).includes("SECRET_MUST_STAY_SERVER_SIDE"), false)
})
