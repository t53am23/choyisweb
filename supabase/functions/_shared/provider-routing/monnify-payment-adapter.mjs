const MONNIFY_BASE_URLS = Object.freeze({
  sandbox: "https://sandbox.monnify.com",
  live: "https://api.monnify.com",
})

function requireText(value, name) {
  const text = String(value ?? "").trim()
  if (!text) throw new Error(`${name} is required.`)
  return text
}

function toMajorUnits(amountMinor) {
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
    throw new Error("Expected amount must be a positive integer in minor units.")
  }
  return amountMinor / 100
}

function toMinorUnits(amountMajor) {
  const numeric = Number(amountMajor)
  if (!Number.isFinite(numeric) || numeric < 0) throw new Error("Monnify returned an invalid amount.")
  return Math.round(numeric * 100)
}

async function responseJson(response, message) {
  const body = await response.json().catch(() => null)
  if (!response.ok || !body?.requestSuccessful || !body.responseBody) throw new Error(message)
  return body.responseBody
}

function normalizedPaymentStatus(status) {
  switch (String(status ?? "").toUpperCase()) {
    case "PAID":
    case "OVERPAID":
      return "paid"
    case "PENDING":
      return "pending"
    case "FAILED":
    case "PARTIALLY_PAID":
    case "REVERSED":
    case "EXPIRED":
    case "CANCELLED":
      return "failed"
    default:
      return "unknown"
  }
}

export function createMonnifyPaymentAdapter({
  environment,
  apiKey,
  secretKey,
  contractCode,
  fetchImpl = fetch,
}) {
  const normalizedEnvironment = requireText(environment, "Monnify environment").toLowerCase()
  const baseUrl = MONNIFY_BASE_URLS[normalizedEnvironment]
  if (!baseUrl) throw new Error("Monnify environment must be sandbox or live.")

  const publicApiKey = requireText(apiKey, "Monnify API key")
  const privateSecretKey = requireText(secretKey, "Monnify secret key")
  const publicContractCode = requireText(contractCode, "Monnify contract code")

  return {
    name: "monnify",
    enabled: true,

    async initialize({ operation, attempt }) {
      return {
        status: "ready",
        checkout: {
          provider: "monnify",
          environment: normalizedEnvironment,
          apiKey: publicApiKey,
          contractCode: publicContractCode,
          reference: attempt.providerReference,
          amount: toMajorUnits(operation.amountMinor),
          currency: operation.currency,
          customerEmail: operation.customerEmail,
          customerName: operation.customerName ?? "Choyis customer",
          description: `Choyis TopUp ${operation.reference}`,
        },
      }
    },

    async verify({ attempt }) {
      const credentials = btoa(`${publicApiKey}:${privateSecretKey}`)
      const authenticationResponse = await fetchImpl(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          authorization: `Basic ${credentials}`,
          "content-type": "application/json",
        },
      })
      const authentication = await responseJson(authenticationResponse, "Monnify authentication failed.")
      const accessToken = requireText(authentication.accessToken, "Monnify access token")

      const verificationUrl = new URL(`${baseUrl}/api/v2/merchant/transactions/query`)
      verificationUrl.searchParams.set("paymentReference", attempt.providerReference)
      const verificationResponse = await fetchImpl(verificationUrl, {
        headers: { authorization: `Bearer ${accessToken}` },
      })
      const transaction = await responseJson(verificationResponse, "Monnify verification failed.")

      return {
        status: normalizedPaymentStatus(transaction.paymentStatus),
        providerReference: transaction.paymentReference ?? null,
        providerTransactionReference: transaction.transactionReference ?? null,
        amountPaidMinor: toMinorUnits(transaction.amountPaid ?? 0),
        currency: transaction.currencyCode ?? transaction.currency ?? null,
        paymentMethod: transaction.paymentMethod ?? null,
      }
    },
  }
}
