import { HttpError } from "./edge-http.mjs"

function text(value, name, minimum = 1, maximum = 128) {
  const normalized = String(value ?? "").trim()
  if (normalized.length < minimum || normalized.length > maximum) {
    throw new HttpError(400, "INVALID_REQUEST", `${name} is invalid.`)
  }
  return normalized
}

export function operationReference(value) {
  const normalized = text(value, "Operation reference", 8, 128)
  if (!/^[A-Z0-9_-]+$/i.test(normalized)) {
    throw new HttpError(400, "INVALID_REQUEST", "Operation reference is invalid.")
  }
  return normalized
}

export function prepareInput(body, user) {
  const serviceType = text(body.serviceType ?? body.service_type, "Service type").toLowerCase()
  if (!new Set(["airtime", "data"]).has(serviceType)) {
    throw new HttpError(400, "SERVICE_NOT_ENABLED", "Only airtime and data are enabled in this Sandbox batch.")
  }
  const serviceCode = text(body.serviceCode ?? body.service_code ?? body.network, "Service provider", 2, 64).toLowerCase()
  if (!/^[a-z0-9_-]+$/.test(serviceCode)) throw new HttpError(400, "INVALID_REQUEST", "Service provider is invalid.")
  const phone = text(body.phone, "Phone number", 11, 14).replace(/\s/g, "")
  if (!/^0\d{10}$/.test(phone)) throw new HttpError(400, "INVALID_PHONE", "Enter a valid Nigerian phone number.")
  const amountMinor = Number(body.amountMinor ?? body.amount_minor)
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 5_000 || amountMinor > 5_000_000) {
    throw new HttpError(400, "INVALID_AMOUNT", "Amount must be between ₦50 and ₦50,000.")
  }
  const variationCode = body.variationCode ?? body.variation_code
  return {
    idempotencyKey: text(body.idempotencyKey ?? body.idempotency_key, "Idempotency key", 16, 128),
    userId: user.id,
    serviceType,
    serviceCode,
    variationCode: variationCode == null ? null : text(variationCode, "Variation code", 1, 128),
    customerIdentifier: text(body.customerIdentifier ?? body.customer_identifier ?? phone, "Customer identifier", 3, 128),
    phone,
    customerEmail: user.email,
    customerName: String(user.user_metadata?.full_name ?? user.user_metadata?.name ?? "").trim() || null,
    amountMinor,
    currency: "NGN",
  }
}

export function createOperationReference(now = () => new Date(), randomId = () => crypto.randomUUID()) {
  const date = now().toISOString().slice(0, 10).replaceAll("-", "")
  const suffix = randomId().replace(/[^a-zA-Z0-9]/g, "").slice(0, 20).toUpperCase()
  return `CTU-${date}-${suffix}`
}
