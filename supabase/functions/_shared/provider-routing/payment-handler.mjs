import {
  authenticateRequest,
  corsHeaders,
  errorResponse,
  HttpError,
  jsonResponse,
  readJson,
  requireAllowedOrigin,
  requireOwnedOperation,
} from "./edge-http.mjs"
import { operationReference } from "./request-validation.mjs"

export function createPaymentHandler({ environment, repository, paymentRouter, fetchImpl = fetch }) {
  return async function handle(request) {
    const headers = corsHeaders(request, environment)
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers })
    try {
      requireAllowedOrigin(request, headers)
      if (request.method !== "POST") throw new HttpError(405, "METHOD_NOT_ALLOWED", "Use POST for this endpoint.")
      const user = await authenticateRequest(request, {
        supabaseUrl: environment.SUPABASE_URL,
        anonKey: environment.SUPABASE_ANON_KEY,
        fetchImpl,
      })
      const body = await readJson(request)
      const reference = operationReference(body.operationReference ?? body.operation_reference)
      requireOwnedOperation(await repository.getOperation(reference), user)

      if (body.action === "start") {
        return jsonResponse(await paymentRouter.startPayment(reference), 200, headers)
      }
      if (body.action === "reconcile") {
        return jsonResponse(await paymentRouter.reconcilePayment(reference), 200, headers)
      }
      throw new HttpError(400, "INVALID_ACTION", "Payment action is invalid.")
    } catch (error) {
      return errorResponse(error, headers)
    }
  }
}
