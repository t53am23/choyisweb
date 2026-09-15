import { createMonnifyPaymentAdapter } from "./monnify-payment-adapter.mjs"
import { createPaystackPaymentAdapter } from "./paystack-payment-adapter.mjs"
import { createVtpassVendingAdapter } from "./vtpass-vending-adapter.mjs"

function required(environment, name) {
  const value = String(environment[name] ?? "").trim()
  if (!value) throw new Error(`${name} is required.`)
  return value
}

function enabled(environment, name) {
  const value = String(environment[name] ?? "false").trim().toLowerCase()
  if (!new Set(["true", "false"]).has(value)) {
    throw new Error(`${name} must be true or false.`)
  }
  return value === "true"
}

function environmentSecret(environment, provider, environmentName, suffix) {
  return required(environment, `TOPUP_${provider}_${environmentName.toUpperCase()}_${suffix}`)
}

export function createProviderConfiguration({ environment, fetchImpl = fetch }) {
  const payment = createPaymentProviderConfiguration({ environment, fetchImpl })
  const vending = createVendingProviderConfiguration({ environment, fetchImpl })
  return {
    environment: payment.environment,
    paymentProviders: payment.providers,
    vendingProviders: vending.providers,
  }
}

function environmentName(environment) {
  const environmentName = required(environment, "TOPUP_ROUTER_ENVIRONMENT").toLowerCase()
  if (!new Set(["sandbox", "live"]).has(environmentName)) {
    throw new Error("TOPUP_ROUTER_ENVIRONMENT must be sandbox or live.")
  }
  return environmentName
}

export function createPaymentProviderConfiguration({ environment, fetchImpl = fetch }) {
  const selectedEnvironment = environmentName(environment)
  if (enabled(environment, "TOPUP_OPAY_ENABLED")) {
    throw new Error("OPay routing is not implemented because an approved Online Gateway contract is not configured.")
  }

  const paymentProviders = [createMonnifyPaymentAdapter({
    environment: selectedEnvironment,
    apiKey: environmentSecret(environment, "MONNIFY", selectedEnvironment, "API_KEY"),
    secretKey: environmentSecret(environment, "MONNIFY", selectedEnvironment, "SECRET_KEY"),
    contractCode: environmentSecret(environment, "MONNIFY", selectedEnvironment, "CONTRACT_CODE"),
    fetchImpl,
  })]

  if (enabled(environment, "TOPUP_PAYSTACK_ENABLED")) {
    paymentProviders.push(createPaystackPaymentAdapter({
      environment: selectedEnvironment,
      secretKey: environmentSecret(environment, "PAYSTACK", selectedEnvironment, "SECRET_KEY"),
      fetchImpl,
    }))
  }

  return { environment: selectedEnvironment, providers: paymentProviders }
}

export function createVendingProviderConfiguration({ environment, fetchImpl = fetch }) {
  const selectedEnvironment = environmentName(environment)
  if (enabled(environment, "TOPUP_MONNIFY_BILLS_ENABLED")) {
    throw new Error("Monnify Bills routing remains disabled until the account is activated and the adapter is tested.")
  }

  const vendingProviders = [createVtpassVendingAdapter({
    environment: selectedEnvironment,
    apiKey: environmentSecret(environment, "VTPASS", selectedEnvironment, "API_KEY"),
    publicKey: environmentSecret(environment, "VTPASS", selectedEnvironment, "PUBLIC_KEY"),
    secretKey: environmentSecret(environment, "VTPASS", selectedEnvironment, "SECRET_KEY"),
    fetchImpl,
  })]

  return { environment: selectedEnvironment, providers: vendingProviders }
}
