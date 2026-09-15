import assert from "node:assert/strict"
import test from "node:test"

import { createVtpassVendingAdapter } from "./vtpass-vending-adapter.mjs"

test("VTpass request IDs begin with the current Lagos timestamp", () => {
  const adapter = createVtpassVendingAdapter({
    environment: "sandbox",
    apiKey: "sandbox-api-key",
    publicKey: "sandbox-public-key",
    secretKey: "sandbox-secret-key",
    now: () => new Date("2026-09-15T10:23:00.000Z"),
    randomId: () => "ABC123",
  })

  assert.equal(adapter.createReference(), "202609151123ABC123")
})

test("VTpass Sandbox availability resolves the requested service from its live catalogue response", async () => {
  const requests = []
  const adapter = createVtpassVendingAdapter({
    environment: "sandbox",
    apiKey: "sandbox-api-key",
    publicKey: "sandbox-public-key",
    secretKey: "sandbox-secret-key",
    fetchImpl: async (url, init = {}) => {
      requests.push({ url: String(url), init })
      return new Response(JSON.stringify({
        response_description: "000",
        content: [
          { serviceID: "mtn", name: "MTN Airtime VTU", minimium_amount: "50", maximum_amount: "50000" },
        ],
      }), { status: 200, headers: { "content-type": "application/json" } })
    },
  })

  const result = await adapter.checkAvailability({
    operation: { serviceType: "airtime", serviceCode: "mtn", amountMinor: 200_00 },
  })

  assert.equal(requests[0].url, "https://sandbox.vtpass.com/api/services?identifier=airtime")
  assert.equal(requests[0].init.headers["api-key"], "sandbox-api-key")
  assert.equal(requests[0].init.headers["public-key"], "sandbox-public-key")
  assert.equal(Object.hasOwn(requests[0].init.headers, "secret-key"), false)
  assert.deepEqual(result, {
    status: "available",
    productCode: "mtn",
    productName: "MTN Airtime VTU",
    minimumAmountMinor: 50_00,
    maximumAmountMinor: 50_000_00,
  })
})

test("VTpass data availability validates the exact live variation and price", async () => {
  const requests = []
  const adapter = createVtpassVendingAdapter({
    environment: "sandbox",
    apiKey: "sandbox-api-key",
    publicKey: "sandbox-public-key",
    secretKey: "sandbox-secret-key",
    fetchImpl: async (url, init = {}) => {
      requests.push({ url: String(url), init })
      const body = String(url).includes("service-variations")
        ? { content: { variations: [{ variation_code: "mtn-1gb", name: "1GB", variation_amount: "500" }] } }
        : { content: [{ serviceID: "mtn-data", name: "MTN Data", minimium_amount: "1", maximum_amount: "50000" }] }
      return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } })
    },
  })

  const result = await adapter.checkAvailability({
    operation: {
      serviceType: "data",
      serviceCode: "mtn-data",
      variationCode: "mtn-1gb",
      amountMinor: 500_00,
    },
  })

  assert.equal(requests[1].url, "https://sandbox.vtpass.com/api/service-variations?serviceID=mtn-data")
  assert.equal(Object.hasOwn(requests[1].init.headers, "secret-key"), false)
  assert.equal(result.status, "available")
  assert.equal(result.variationCode, "mtn-1gb")
  assert.equal(result.amountMinor, 500_00)
})

test("VTpass data availability rejects a client amount that differs from the live variation price", async () => {
  const adapter = createVtpassVendingAdapter({
    environment: "sandbox",
    apiKey: "sandbox-api-key",
    publicKey: "sandbox-public-key",
    secretKey: "sandbox-secret-key",
    fetchImpl: async (url) => new Response(JSON.stringify(
      String(url).includes("service-variations")
        ? { content: { variations: [{ variation_code: "mtn-1gb", name: "1GB", variation_amount: "500" }] } }
        : { content: [{ serviceID: "mtn-data", name: "MTN Data", minimium_amount: "1", maximum_amount: "50000" }] },
    ), { status: 200, headers: { "content-type": "application/json" } }),
  })

  const result = await adapter.checkAvailability({
    operation: {
      serviceType: "data",
      serviceCode: "mtn-data",
      variationCode: "mtn-1gb",
      amountMinor: 100_00,
    },
  })

  assert.deepEqual(result, { status: "unavailable", definitive: true, failureCode: "VARIATION_PRICE_MISMATCH" })
})

test("VTpass pending vend is requeried with the same request ID before delivery", async () => {
  const requests = []
  const responses = [
    {
      code: "099",
      response_description: "TRANSACTION IS PROCESSING",
      requestId: "202609151123ABC123",
      content: { transactions: { status: "pending" } },
    },
    {
      code: "000",
      response_description: "TRANSACTION SUCCESSFUL",
      requestId: "202609151123ABC123",
      purchased_code: "",
      content: { transactions: { status: "delivered", transactionId: "VTP-001" } },
    },
  ]
  const adapter = createVtpassVendingAdapter({
    environment: "sandbox",
    apiKey: "sandbox-api-key",
    publicKey: "sandbox-public-key",
    secretKey: "sandbox-secret-key",
    fetchImpl: async (url, init = {}) => {
      requests.push({ url: String(url), init, body: init.body ? JSON.parse(init.body) : null })
      return new Response(JSON.stringify(responses.shift()), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    },
  })
  const operation = {
    serviceType: "airtime",
    serviceCode: "mtn",
    customerIdentifier: "08031234567",
    phone: "08031234567",
    amountMinor: 200_00,
  }
  const attempt = { providerReference: "202609151123ABC123" }
  const route = { productCode: "mtn" }

  const vend = await adapter.vend({ operation, attempt, route })
  const requery = await adapter.requery({ operation, attempt })

  assert.equal(vend.status, "pending")
  assert.equal(requery.status, "delivered")
  assert.equal(requery.providerTransactionReference, "VTP-001")
  assert.equal(requests[0].url, "https://sandbox.vtpass.com/api/pay")
  assert.equal(requests[1].url, "https://sandbox.vtpass.com/api/requery")
  assert.equal(requests[0].body.request_id, attempt.providerReference)
  assert.equal(requests[1].body.request_id, attempt.providerReference)
  assert.equal(requests[0].init.headers["secret-key"], "sandbox-secret-key")
  assert.equal(requests[1].init.headers["secret-key"], "sandbox-secret-key")
})
