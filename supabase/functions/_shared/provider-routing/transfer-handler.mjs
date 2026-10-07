import {
  authenticateRequest,
  corsHeaders,
  errorResponse,
  HttpError,
  jsonResponse,
  readJson,
  requireAllowedOrigin,
} from "./edge-http.mjs"

export function createTransferHandler({ environment, transferProvider, fetchImpl = fetch }) {
  return async function handle(request) {
    const headers = corsHeaders(request, environment)
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers })

    try {
      requireAllowedOrigin(request, headers)
      if (request.method !== "POST") throw new HttpError(405, "METHOD_NOT_ALLOWED", "Use POST for this endpoint.")
      await authenticateRequest(request, {
        supabaseUrl: environment.SUPABASE_URL,
        anonKey: environment.SUPABASE_ANON_KEY,
        fetchImpl,
      })
      const body = await readJson(request)

      if (body.action === "banks") {
        return jsonResponse({ provider: "paystack", banks: await transferProvider.listBanks() }, 200, headers)
      }
      if (body.action === "resolve") {
        const account = await transferProvider.resolveAccount({
          accountNumber: body.accountNumber,
          bankCode: body.bankCode,
        })
        return jsonResponse({ provider: "paystack", account }, 200, headers)
      }
      throw new HttpError(400, "INVALID_ACTION", "Transfer action is invalid.")
    } catch (error) {
      return errorResponse(error, headers)
    }
  }
}
