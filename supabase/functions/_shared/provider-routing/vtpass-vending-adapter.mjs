const VTPASS_BASE_URLS = Object.freeze({
  sandbox: "https://sandbox.vtpass.com/api",
  live: "https://vtpass.com/api",
})

function requireText(value, name) {
  const text = String(value ?? "").trim()
  if (!text) throw new Error(`${name} is required.`)
  return text
}

function toMinorUnits(amountMajor) {
  const numeric = Number(amountMajor)
  if (!Number.isFinite(numeric) || numeric < 0) return null
  return Math.round(numeric * 100)
}

async function parseResponse(response, message) {
  const body = await response.json().catch(() => null)
  if (!response.ok || !body) throw new Error(message)
  return body
}

const VTPASS_PENDING_CODES = new Set(["001", "014", "089", "099"])
const VTPASS_DEFINITIVE_FAILURE_CODES = new Set([
  "010", "011", "012", "013", "016", "017", "018", "032", "034", "035", "040", "087", "091",
])

function normalizedVendResult(body) {
  const code = String(body?.code ?? "")
  const transaction = body?.content?.transactions ?? {}
  const providerStatus = String(transaction.status ?? "").toLowerCase()
  const common = {
    providerTransactionReference: transaction.transactionId ?? body?.transactionId ?? null,
    responseCode: code || null,
    responseDescription: body?.response_description ?? null,
    purchasedCode: body?.purchased_code ?? null,
  }

  if (providerStatus === "delivered") return { ...common, status: "delivered", definitive: true }
  if (providerStatus === "pending" || providerStatus === "initiated" || VTPASS_PENDING_CODES.has(code)) {
    return { ...common, status: "pending", definitive: false }
  }
  if (VTPASS_DEFINITIVE_FAILURE_CODES.has(code) || providerStatus === "failed") {
    return { ...common, status: "failed", definitive: true, fulfillmentPossible: false }
  }
  return { ...common, status: "unknown", definitive: false }
}

function lagosTimestamp(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)
  const value = (type) => parts.find((part) => part.type === type)?.value ?? ""
  return `${value("year")}${value("month")}${value("day")}${value("hour")}${value("minute")}`
}

export function createVtpassVendingAdapter({
  environment,
  apiKey,
  publicKey,
  secretKey,
  fetchImpl = fetch,
  now = () => new Date(),
  randomId = () => crypto.randomUUID().replaceAll("-", "").slice(0, 10),
}) {
  const normalizedEnvironment = requireText(environment, "VTpass environment").toLowerCase()
  const baseUrl = VTPASS_BASE_URLS[normalizedEnvironment]
  if (!baseUrl) throw new Error("VTpass environment must be sandbox or live.")
  const privateApiKey = requireText(apiKey, "VTpass API key")
  const privatePublicKey = requireText(publicKey, "VTpass public key")
  const privateSecretKey = requireText(secretKey, "VTpass secret key")
  const authenticatedHeaders = {
    "api-key": privateApiKey,
    "public-key": privatePublicKey,
    "secret-key": privateSecretKey,
    "content-type": "application/json",
  }
  const catalogueHeaders = {
    "api-key": privateApiKey,
    "public-key": privatePublicKey,
  }

  return {
    name: "vtpass",
    enabled: true,

    createReference() {
      const suffix = requireText(randomId(), "VTpass request suffix").replace(/[^a-zA-Z0-9]/g, "")
      return `${lagosTimestamp(now())}${suffix}`
    },

    async checkAvailability({ operation }) {
      const url = new URL(`${baseUrl}/services`)
      url.searchParams.set("identifier", requireText(operation.serviceType, "Service type"))
      const response = await fetchImpl(url, {
        headers: catalogueHeaders,
      })
      const body = await parseResponse(response, "VTpass service discovery failed.")
      const services = Array.isArray(body.content) ? body.content : []
      const requestedCode = requireText(operation.serviceCode, "Service code").toLowerCase()
      const service = services.find((candidate) => String(candidate?.serviceID ?? "").toLowerCase() === requestedCode)
      if (!service) return { status: "unavailable", definitive: true }

      const minimumAmountMinor = toMinorUnits(service.minimium_amount ?? service.minimum_amount ?? 0)
      const maximumAmountMinor = toMinorUnits(service.maximum_amount ?? 0)
      if (
        (minimumAmountMinor !== null && operation.amountMinor < minimumAmountMinor)
        || (maximumAmountMinor !== null && maximumAmountMinor > 0 && operation.amountMinor > maximumAmountMinor)
      ) {
        return { status: "unavailable", definitive: true, failureCode: "AMOUNT_OUT_OF_RANGE" }
      }

      if (String(operation.serviceType).toLowerCase() === "data") {
        const variationCode = requireText(operation.variationCode, "Variation code")
        const variationsUrl = new URL(`${baseUrl}/service-variations`)
        variationsUrl.searchParams.set("serviceID", service.serviceID)
        const variationsResponse = await fetchImpl(variationsUrl, { headers: catalogueHeaders })
        const variationsBody = await parseResponse(variationsResponse, "VTpass variation discovery failed.")
        const variations = Array.isArray(variationsBody?.content?.variations)
          ? variationsBody.content.variations
          : Array.isArray(variationsBody?.content?.varations)
            ? variationsBody.content.varations
            : []
        const variation = variations.find(
          (candidate) => String(candidate?.variation_code ?? "") === variationCode,
        )
        if (!variation) {
          return { status: "unavailable", definitive: true, failureCode: "VARIATION_UNAVAILABLE" }
        }
        const variationAmountMinor = toMinorUnits(variation.variation_amount)
        if (variationAmountMinor === null || variationAmountMinor !== operation.amountMinor) {
          return { status: "unavailable", definitive: true, failureCode: "VARIATION_PRICE_MISMATCH" }
        }
        return {
          status: "available",
          productCode: service.serviceID,
          productName: service.name ?? service.serviceID,
          variationCode,
          variationName: variation.name ?? variationCode,
          amountMinor: variationAmountMinor,
          minimumAmountMinor,
          maximumAmountMinor,
        }
      }

      return {
        status: "available",
        productCode: service.serviceID,
        productName: service.name ?? service.serviceID,
        minimumAmountMinor,
        maximumAmountMinor,
      }
    },

    async vend({ operation, attempt, route }) {
      const payload = {
        request_id: requireText(attempt.providerReference, "VTpass request ID"),
        serviceID: requireText(route.productCode ?? operation.serviceCode, "VTpass service ID"),
        billersCode: requireText(operation.customerIdentifier, "Customer identifier"),
        amount: operation.amountMinor / 100,
        phone: requireText(operation.phone ?? operation.customerIdentifier, "Customer phone"),
      }
      if (operation.variationCode) payload.variation_code = operation.variationCode

      const response = await fetchImpl(`${baseUrl}/pay`, {
        method: "POST",
        headers: authenticatedHeaders,
        body: JSON.stringify(payload),
      })
      return normalizedVendResult(await parseResponse(response, "VTpass vending failed."))
    },

    async requery({ attempt }) {
      const response = await fetchImpl(`${baseUrl}/requery`, {
        method: "POST",
        headers: authenticatedHeaders,
        body: JSON.stringify({ request_id: requireText(attempt.providerReference, "VTpass request ID") }),
      })
      return normalizedVendResult(await parseResponse(response, "VTpass requery failed."))
    },
  }
}
