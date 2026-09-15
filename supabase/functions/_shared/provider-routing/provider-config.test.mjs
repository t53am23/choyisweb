import assert from "node:assert/strict"
import test from "node:test"

import { createProviderConfiguration } from "./provider-config.mjs"

const sandboxEnvironment = {
  TOPUP_ROUTER_ENVIRONMENT: "sandbox",
  TOPUP_MONNIFY_SANDBOX_API_KEY: "MK_TEST_public",
  TOPUP_MONNIFY_SANDBOX_SECRET_KEY: "test-secret",
  TOPUP_MONNIFY_SANDBOX_CONTRACT_CODE: "test-contract",
  TOPUP_VTPASS_SANDBOX_API_KEY: "vtpass-test-api",
  TOPUP_VTPASS_SANDBOX_PUBLIC_KEY: "vtpass-test-public",
  TOPUP_VTPASS_SANDBOX_SECRET_KEY: "vtpass-test-secret",
}

test("provider configuration fails closed when the environment is not explicit", () => {
  assert.throws(
    () => createProviderConfiguration({ environment: {}, fetchImpl: async () => {} }),
    /TOPUP_ROUTER_ENVIRONMENT/,
  )
})

test("Sandbox configuration creates only the approved provider priority", () => {
  const configuration = createProviderConfiguration({
    environment: sandboxEnvironment,
    fetchImpl: async () => {},
  })

  assert.equal(configuration.environment, "sandbox")
  assert.deepEqual(configuration.paymentProviders.map(({ name }) => name), ["monnify"])
  assert.deepEqual(configuration.vendingProviders.map(({ name }) => name), ["vtpass"])
})

test("Paystack is appended only when its Sandbox fallback is explicitly enabled", () => {
  const configuration = createProviderConfiguration({
    environment: {
      ...sandboxEnvironment,
      TOPUP_PAYSTACK_ENABLED: "true",
      TOPUP_PAYSTACK_SANDBOX_SECRET_KEY: "sk_test_example",
    },
    fetchImpl: async () => {},
  })

  assert.deepEqual(configuration.paymentProviders.map(({ name }) => name), ["monnify", "paystack"])
})

test("unimplemented OPay and unactivated Monnify Bills cannot be enabled", () => {
  assert.throws(
    () => createProviderConfiguration({
      environment: { ...sandboxEnvironment, TOPUP_OPAY_ENABLED: "true" },
      fetchImpl: async () => {},
    }),
    /OPay.*not implemented/,
  )
  assert.throws(
    () => createProviderConfiguration({
      environment: { ...sandboxEnvironment, TOPUP_MONNIFY_BILLS_ENABLED: "true" },
      fetchImpl: async () => {},
    }),
    /Monnify Bills.*disabled/,
  )
})

test("Sandbox and Live credentials are selected from separate names", () => {
  assert.throws(
    () => createProviderConfiguration({
      environment: {
        ...sandboxEnvironment,
        TOPUP_ROUTER_ENVIRONMENT: "live",
      },
      fetchImpl: async () => {},
    }),
    /TOPUP_MONNIFY_LIVE_API_KEY/,
  )
})
