import { getSupabaseBrowserClient, getSupabasePublicConfig } from "@/lib/supabase/browser"

export type TransferBank = {
  code: string
  name: string
  type: string
}

export type ResolvedTransferAccount = {
  accountName: string
  accountNumber: string
  bankCode: string
}

export class TransferLookupError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly retryable = false,
  ) {
    super(message)
    this.name = "TransferLookupError"
  }
}

async function requireAccessToken() {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) throw new TransferLookupError("Your secure session could not be checked.", "SESSION_ERROR", true)
  if (!data.session?.access_token) {
    throw new TransferLookupError("Sign in to verify a recipient and prepare a transfer.", "AUTH_REQUIRED")
  }
  return data.session.access_token
}

async function invokeTransferRouter<T>(body: Record<string, unknown>): Promise<T> {
  const { url, publishableKey } = getSupabasePublicConfig()
  const accessToken = await requireAccessToken()
  const response = await fetch(`${url}/functions/v1/topup-transfer-router`, {
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
      throw new TransferLookupError("The secure transfer service is not deployed yet.", "TRANSFER_NOT_DEPLOYED")
    }
    throw new TransferLookupError(
      payload.message || payload.error || "The transfer request was rejected.",
      payload.code || "TRANSFER_REJECTED",
      response.status >= 500 || payload.code === "TOPUP_REQUEST_REJECTED",
    )
  }
  return payload
}

export async function loadTransferBanks() {
  const result = await invokeTransferRouter<{ banks: TransferBank[] }>({ action: "banks" })
  return result.banks
}

export async function resolveTransferAccount(accountNumber: string, bankCode: string) {
  const result = await invokeTransferRouter<{ account: ResolvedTransferAccount }>({
    action: "resolve",
    accountNumber,
    bankCode,
  })
  return result.account
}
