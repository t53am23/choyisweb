import { getSupabaseBrowserClient, getSupabasePublicConfig } from "@/lib/supabase/browser"

export type UtilityServiceType = "airtime" | "data" | "electricity" | "tv" | "internet"

export type UtilityCheckoutIntent =
  | {
      serviceType: "airtime"
      phone: string
      provider: "mtn" | "glo" | "airtel" | "9mobile"
      amount: number
      idempotencyKey: string
    }
  | {
      serviceType: Exclude<UtilityServiceType, "airtime">
      provider: string
      customerIdentifier: string
      amount: number
      variationCode?: string
      idempotencyKey: string
    }

export type UtilityCheckoutStatus = "awaiting_payment" | "processing" | "delivered" | "failed"

export interface UtilityCheckoutSession {
  status: "awaiting_payment"
  transactionId: string
  paymentReference: string
  authorizationUrl: string
}

export interface UtilityCheckoutResult {
  status: UtilityCheckoutStatus
  transactionId: string
  itemId?: string
  reference?: string
  phone?: string
  network?: string
  amount?: number
  deliveredAt?: string
}

export class UtilityCheckoutError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly retryable = false,
  ) {
    super(message)
    this.name = "UtilityCheckoutError"
  }
}

function normalizeNigerianPhone(rawPhone: string) {
  const compact = rawPhone.replace(/[^\d+]/g, "")
  const local = compact.startsWith("+234")
    ? `0${compact.slice(4)}`
    : compact.startsWith("234")
      ? `0${compact.slice(3)}`
      : compact

  if (!/^0\d{10}$/.test(local)) {
    throw new UtilityCheckoutError("Enter a valid Nigerian phone number.", "INVALID_PHONE")
  }

  return local
}

function validateAirtimeAmount(rawAmount: number) {
  if (!Number.isInteger(rawAmount) || rawAmount < 50 || rawAmount > 50_000) {
    throw new UtilityCheckoutError(
      "Airtime amount must be a whole value between ₦50 and ₦50,000.",
      "INVALID_AMOUNT",
    )
  }

  return rawAmount
}

function assertPaystackAuthorizationUrl(rawUrl: string) {
  const url = new URL(rawUrl)
  const isPaystack = url.hostname === "paystack.com" || url.hostname.endsWith(".paystack.com")

  if (url.protocol !== "https:" || !isPaystack) {
    throw new UtilityCheckoutError("Payment provider returned an invalid checkout URL.", "INVALID_PAYMENT_URL")
  }

  return url.toString()
}

async function requireAccessToken() {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw new UtilityCheckoutError("Your secure session could not be checked.", "SESSION_ERROR", true)
  }

  if (!data.session?.access_token) {
    throw new UtilityCheckoutError(
      "A secure login is required before payment. Login will be connected in the final implementation step.",
      "AUTH_REQUIRED",
    )
  }

  return data.session.access_token
}

async function invokeCheckout<T>(body: Record<string, unknown>): Promise<T> {
  const { url, publishableKey } = getSupabasePublicConfig()
  const accessToken = await requireAccessToken()
  const response = await fetch(`${url}/functions/v1/topup-checkout`, {
    method: "POST",
    headers: {
      apikey: publishableKey,
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const payload = await response.json().catch(() => ({})) as {
    code?: string
    error?: string
    message?: string
  } & T

  if (!response.ok) {
    if (response.status === 404) {
      throw new UtilityCheckoutError(
        "The secure TopUp service is not deployed yet. Payment was not started.",
        "CHECKOUT_NOT_DEPLOYED",
      )
    }

    throw new UtilityCheckoutError(
      payload.message || payload.error || "The utility checkout request was rejected.",
      payload.code || "CHECKOUT_REJECTED",
      response.status >= 500 || payload.code === "TOPUP_REQUEST_REJECTED",
    )
  }

  return payload
}

export async function startUtilityCheckout(intent: UtilityCheckoutIntent) {
  if (intent.serviceType !== "airtime") {
    throw new UtilityCheckoutError(
      `${intent.serviceType} checkout is not enabled by the secure server interface yet.`,
      "SERVICE_NOT_ENABLED",
    )
  }

  const session = await invokeCheckout<UtilityCheckoutSession>({
    action: "initialize",
    service_type: "airtime",
    phone: normalizeNigerianPhone(intent.phone),
    network: intent.provider,
    amount: validateAirtimeAmount(intent.amount),
    idempotency_key: intent.idempotencyKey,
  })

  return {
    ...session,
    authorizationUrl: assertPaystackAuthorizationUrl(session.authorizationUrl),
  }
}

export function confirmUtilityCheckout(transactionId: string) {
  if (!transactionId.trim()) {
    throw new UtilityCheckoutError("The pending transaction is missing.", "TRANSACTION_REQUIRED")
  }

  return invokeCheckout<UtilityCheckoutResult>({
    action: "confirm",
    transaction_id: transactionId,
  })
}
