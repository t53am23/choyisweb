import assert from "node:assert/strict"
import test from "node:test"

import { createPaystackPaymentAdapter } from "./paystack-payment-adapter.mjs"

test("Paystack test fallback initializes and verifies only from the server", async () => {
  const requests = []
  const responses = [
    {
      status: true,
      data: {
        authorization_url: "https://checkout.paystack.com/test-session",
        access_code: "test-session",
        reference: "CTU-20260915-000001-PAY-2",
      },
    },
    {
      status: true,
      data: {
        id: 123456,
        status: "success",
        reference: "CTU-20260915-000001-PAY-2",
        amount: 200_00,
        currency: "NGN",
        channel: "card",
      },
    },
  ]
  const adapter = createPaystackPaymentAdapter({
    environment: "sandbox",
    secretKey: "sk_test_SERVER_ONLY",
    fetchImpl: async (url, init = {}) => {
      requests.push({ url: String(url), init, body: init.body ? JSON.parse(init.body) : null })
      return new Response(JSON.stringify(responses.shift()), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    },
  })
  const operation = {
    reference: "CTU-20260915-000001",
    amountMinor: 200_00,
    currency: "NGN",
    customerEmail: "buyer@example.com",
  }
  const attempt = { providerReference: "CTU-20260915-000001-PAY-2" }

  const initialized = await adapter.initialize({ operation, attempt })
  const verified = await adapter.verify({ operation, attempt })

  assert.equal(requests[0].url, "https://api.paystack.co/transaction/initialize")
  assert.equal(requests[1].url, "https://api.paystack.co/transaction/verify/CTU-20260915-000001-PAY-2")
  assert.equal(requests[0].init.headers.authorization, "Bearer sk_test_SERVER_ONLY")
  assert.equal(initialized.checkout.authorizationUrl, "https://checkout.paystack.com/test-session")
  assert.equal(JSON.stringify(initialized).includes("sk_test_SERVER_ONLY"), false)
  assert.deepEqual(verified, {
    status: "paid",
    providerReference: "CTU-20260915-000001-PAY-2",
    providerTransactionReference: "123456",
    amountPaidMinor: 200_00,
    currency: "NGN",
    paymentMethod: "card",
  })
})
