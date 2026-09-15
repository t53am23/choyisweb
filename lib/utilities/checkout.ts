import { getSupabaseBrowserClient, getSupabasePublicConfig } from "@/lib/supabase/browser"

export type UtilityServiceType = "airtime" | "data" | "electricity" | "tv" | "internet"

export type UtilityCheckoutIntent =
  | {
      serviceType: "airtime"
      phone: string
      provider: "mtn" | "glo" | "airtel" | "etisalat"
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

interface MonnifyCheckoutConfiguration {
  provider: "monnify"
  environment: "sandbox" | "live"
  apiKey: string
  contractCode: string
  reference: string
  amount: number
  currency: string
  customerEmail: string
  customerName: string
  description: string
}

interface PaystackCheckoutConfiguration {
  provider: "paystack"
  authorizationUrl: string
}

export interface UtilityCheckoutSession {
  status: "ready" | "pending" | "unknown"
  operationReference: string
  attemptId: string
  provider: "monnify" | "paystack"
  providerReference: string
  checkout: MonnifyCheckoutConfiguration | PaystackCheckoutConfiguration
}

export interface UtilityCheckoutResult {
  status: UtilityCheckoutStatus
  transactionId: string
  reference?: string
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

function validateAmount(rawAmount: number) {
  if (!Number.isInteger(rawAmount) || rawAmount < 50 || rawAmount > 50_000) {
    throw new UtilityCheckoutError("Amount must be a whole value between ₦50 and ₦50,000.", "INVALID_AMOUNT")
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
  if (error) throw new UtilityCheckoutError("Your secure session could not be checked.", "SESSION_ERROR", true)
  if (!data.session?.access_token) {
    throw new UtilityCheckoutError("A secure login is required before payment.", "AUTH_REQUIRED")
  }
  return data.session.access_token
}

async function invokeRouter<T>(functionName: string, body: Record<string, unknown>): Promise<T> {
  const { url, publishableKey } = getSupabasePublicConfig()
  const accessToken = await requireAccessToken()
  const response = await fetch(`${url}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      apikey: publishableKey,
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
  const payload = await response.json().catch(() => ({})) as { code?: string; error?: string; message?: string } & T
  if (!response.ok) {
    if (response.status === 404) {
      throw new UtilityCheckoutError("The secure TopUp service is not deployed yet.", "CHECKOUT_NOT_DEPLOYED")
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
  if (!new Set<UtilityServiceType>(["airtime", "data"]).has(intent.serviceType)) {
    throw new UtilityCheckoutError(`${intent.serviceType} checkout is not enabled in this Sandbox batch.`, "SERVICE_NOT_ENABLED")
  }
  const amount = validateAmount(intent.amount)
  const phone = normalizeNigerianPhone(intent.serviceType === "airtime" ? intent.phone : intent.customerIdentifier)
  const prepared = await invokeRouter<{
    operationReference: string
    availability: { status: string }
  }>("topup-vending-router", {
    action: "prepare",
    service_type: intent.serviceType,
    service_code: intent.provider,
    variation_code: "variationCode" in intent ? intent.variationCode : undefined,
    customer_identifier: phone,
    phone,
    amount_minor: amount * 100,
    idempotency_key: intent.idempotencyKey,
  })
  if (prepared.availability.status !== "available") {
    throw new UtilityCheckoutError(
      prepared.availability.status === "unavailable"
        ? "This service is currently unavailable. No payment was started."
        : "Service availability could not be confirmed. No payment was started.",
      "SERVICE_UNAVAILABLE",
      prepared.availability.status !== "unavailable",
    )
  }
  return invokeRouter<UtilityCheckoutSession>("topup-payment-router", {
    action: "start",
    operation_reference: prepared.operationReference,
  })
}

export async function openUtilityCheckout(session: UtilityCheckoutSession) {
  if (session.provider === "paystack") {
    if (session.checkout.provider !== "paystack") {
      throw new UtilityCheckoutError("Payment configuration is invalid.", "INVALID_PAYMENT_CONFIG")
    }
    window.location.assign(assertPaystackAuthorizationUrl(session.checkout.authorizationUrl))
    return "redirected" as const
  }
  const checkout = session.checkout
  if (checkout.provider !== "monnify") {
    throw new UtilityCheckoutError("Payment configuration is invalid.", "INVALID_PAYMENT_CONFIG")
  }

  const { default: Monnify } = await import("monnify-ts")
  const monnify = new Monnify(checkout.apiKey, checkout.contractCode)
  return new Promise<"completed" | "closed">((resolve, reject) => {
    monnify.initializePayment({
      amount: checkout.amount,
      currency: checkout.currency,
      reference: checkout.reference,
      customerFullName: checkout.customerName,
      customerEmail: checkout.customerEmail,
      paymentDescription: checkout.description,
      onLoadStart: () => undefined,
      onLoadComplete: () => undefined,
      onComplete: () => resolve("completed"),
      onClose: () => resolve("closed"),
    }).catch(() => reject(new UtilityCheckoutError(
      "The secure payment window could not be opened.",
      "PAYMENT_SDK_FAILED",
      true,
    )))
  })
}

export async function confirmUtilityCheckout(operationReference: string): Promise<UtilityCheckoutResult> {
  const payment = await invokeRouter<{ status: string }>("topup-payment-router", {
    action: "reconcile",
    operation_reference: operationReference,
  })
  if (payment.status !== "paid") {
    return {
      status: payment.status === "failed" ? "failed" : "awaiting_payment",
      transactionId: operationReference,
      reference: operationReference,
    }
  }
  const vend = await invokeRouter<{ status: string }>("topup-vending-router", {
    action: "dispatch",
    operation_reference: operationReference,
  })
  return {
    status: vend.status === "delivered" ? "delivered" : vend.status === "failed" ? "failed" : "processing",
    transactionId: operationReference,
    reference: operationReference,
  }
}
