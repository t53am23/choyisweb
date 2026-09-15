function requireText(value, name) {
  const text = String(value ?? "").trim()
  if (!text) throw new Error(`${name} is required.`)
  return text
}

async function responseJson(response, message) {
  const body = await response.json().catch(() => null)
  if (!response.ok || !body?.status || !body.data) throw new Error(message)
  return body.data
}

function normalizedStatus(status) {
  switch (String(status ?? "").toLowerCase()) {
    case "success":
      return "paid"
    case "pending":
    case "ongoing":
    case "processing":
    case "queued":
      return "pending"
    case "failed":
    case "abandoned":
    case "reversed":
      return "failed"
    default:
      return "unknown"
  }
}

export function createPaystackPaymentAdapter({ environment, secretKey, fetchImpl = fetch }) {
  const normalizedEnvironment = requireText(environment, "Paystack environment").toLowerCase()
  if (!new Set(["sandbox", "live"]).has(normalizedEnvironment)) {
    throw new Error("Paystack environment must be sandbox or live.")
  }
  const privateSecretKey = requireText(secretKey, "Paystack secret key")
  if (normalizedEnvironment === "sandbox" && !privateSecretKey.startsWith("sk_test_")) {
    throw new Error("Paystack Sandbox requires a test secret key.")
  }
  if (normalizedEnvironment === "live" && !privateSecretKey.startsWith("sk_live_")) {
    throw new Error("Paystack Live requires a live secret key.")
  }
  const headers = {
    authorization: `Bearer ${privateSecretKey}`,
    "content-type": "application/json",
  }

  return {
    name: "paystack",
    enabled: true,

    async initialize({ operation, attempt }) {
      const response = await fetchImpl("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: requireText(operation.customerEmail, "Customer email"),
          amount: operation.amountMinor,
          currency: operation.currency,
          reference: attempt.providerReference,
          metadata: {
            topup_operation_reference: operation.reference,
          },
        }),
      })
      const transaction = await responseJson(response, "Paystack initialization failed.")
      return {
        status: "ready",
        checkout: {
          provider: "paystack",
          environment: normalizedEnvironment,
          authorizationUrl: transaction.authorization_url,
          accessCode: transaction.access_code,
          reference: transaction.reference,
        },
      }
    },

    async verify({ attempt }) {
      const response = await fetchImpl(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(attempt.providerReference)}`,
        { headers },
      )
      const transaction = await responseJson(response, "Paystack verification failed.")
      return {
        status: normalizedStatus(transaction.status),
        providerReference: transaction.reference ?? null,
        providerTransactionReference: transaction.id === undefined ? null : String(transaction.id),
        amountPaidMinor: Number(transaction.amount),
        currency: transaction.currency ?? null,
        paymentMethod: transaction.channel ?? null,
      }
    },
  }
}
