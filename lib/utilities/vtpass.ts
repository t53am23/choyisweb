import { getSupabasePublicConfig } from "@/lib/supabase/browser"

export type UtilityVariation = {
  id: string
  code: string
  name: string
  amount: number
}

type VtpassPayload = Record<string, unknown>

type VerifyUtilityOptions = {
  type?: "prepaid" | "postpaid"
  signal?: AbortSignal
}

const variationCache = new Map<string, UtilityVariation[]>()

function publicMessageFrom(payload: VtpassPayload, fallback: string) {
  for (const key of ["public_message", "publicMessage"]) {
    const value = payload[key]
    if (typeof value === "string" && value.trim()) return value.trim()
  }
  return fallback
}

function publicHeaders(publishableKey: string) {
  return {
    apikey: publishableKey,
    Authorization: `Bearer ${publishableKey}`,
  }
}

function parseVariations(payload: VtpassPayload): UtilityVariation[] {
  const content = payload.content
  if (!content || typeof content !== "object") return []

  const record = content as VtpassPayload
  const entries = Array.isArray(record.variations)
    ? record.variations
    : Array.isArray(record.varations)
      ? record.varations
      : []

  return entries.flatMap((entry, index) => {
    if (!entry || typeof entry !== "object") return []
    const item = entry as VtpassPayload
    const code = typeof item.variation_code === "string" ? item.variation_code.trim() : ""
    const name = typeof item.name === "string" ? item.name.trim() : ""
    const amount = Number(item.variation_amount)

    return code && name && Number.isFinite(amount) && amount >= 0
      ? [{ id: `${code}:${index}`, code, name, amount }]
      : []
  })
}

export async function getUtilityVariations(serviceId: string, signal?: AbortSignal) {
  const normalizedServiceId = serviceId.trim().toLowerCase()
  const cached = variationCache.get(normalizedServiceId)
  if (cached) return cached

  const { url, publishableKey } = getSupabasePublicConfig()
  const endpoint = new URL(`${url}/functions/v1/vtpass-utilities`)
  endpoint.searchParams.set("action", "variations")
  endpoint.searchParams.set("serviceID", normalizedServiceId)

  const response = await fetch(endpoint, {
    headers: publicHeaders(publishableKey),
    method: "GET",
    signal,
  })
  const payload = (await response.json().catch(() => ({}))) as VtpassPayload

  if (!response.ok || (typeof payload.code === "string" && payload.code !== "000")) {
    throw new Error(publicMessageFrom(payload, "Could not load live plans. Please try again."))
  }

  const variations = parseVariations(payload)
  variationCache.set(normalizedServiceId, variations)
  return variations
}

export async function verifyUtilityCustomer(
  serviceId: string,
  billersCode: string,
  options: VerifyUtilityOptions = {},
) {
  const { url, publishableKey } = getSupabasePublicConfig()
  const response = await fetch(`${url}/functions/v1/vtpass-utilities`, {
    method: "POST",
    headers: {
      ...publicHeaders(publishableKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "verify",
      serviceID: serviceId,
      billersCode,
      ...(options.type ? { type: options.type } : {}),
    }),
    signal: options.signal,
  })
  const payload = (await response.json().catch(() => ({}))) as VtpassPayload

  if (!response.ok || payload.code !== "000") {
    throw new Error(publicMessageFrom(payload, "We could not verify these account details. Please check them and try again."))
  }

  const content = payload.content
  const customer = content && typeof content === "object" ? (content as VtpassPayload) : {}
  const wrongBillersCode = customer.WrongBillersCode === true || customer.WrongBillersCode === "true"

  if (wrongBillersCode) {
    throw new Error("This account number was not recognized for the selected provider and type.")
  }

  const name = [customer.Customer_Name, customer.customer_name, customer.name]
    .find((value) => typeof value === "string" && value.trim())
  const address = [customer.Address, customer.address]
    .find((value) => typeof value === "string" && value.trim())
  const meterNumber = [customer.Meter_Number, customer.MeterNumber, customer.meter_number, customer.Account_Number]
    .find((value) => (typeof value === "string" || typeof value === "number") && String(value).trim())
  const meterType = [customer.Meter_Type, customer.meter_type]
    .find((value) => typeof value === "string" && value.trim())
  const minimumValue = [customer.Min_Purchase_Amount, customer.Minimum_Amount, customer.Min_Purchase]
    .find((value) => value !== null && value !== undefined && String(value).trim() !== "")
  const minimumPurchase = Number(minimumValue)

  if (!name && !address && meterNumber === undefined) {
    throw new Error("We could not verify these account details. Please check them and try again.")
  }

  return {
    name: typeof name === "string" ? name.trim() : "",
    address: typeof address === "string" ? address.trim() : "",
    meterNumber: meterNumber === undefined ? "" : String(meterNumber).trim(),
    meterType: typeof meterType === "string" ? meterType.trim() : "",
    minimumPurchase: Number.isFinite(minimumPurchase) && minimumPurchase >= 0 ? minimumPurchase : null,
  }
}
