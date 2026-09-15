import {
  authenticateRequest,
  corsHeaders,
  errorResponse,
  HttpError,
  jsonResponse,
  readJson,
  requireAllowedOrigin,
  requireInternalRequest,
  requireOwnedOperation,
} from "./edge-http.mjs"
import { createOperationReference, operationReference, prepareInput } from "./request-validation.mjs"

function publicOperation(operation) {
  return {
    operationReference: operation.reference,
    availabilityStatus: operation.availabilityStatus,
    paymentStatus: operation.paymentStatus,
    vendStatus: operation.vendStatus,
  }
}

export function createVendingHandler({ environment, repository, vendingRouter, fetchImpl = fetch }) {
  return async function handle(request) {
    const headers = corsHeaders(request, environment)
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers })
    try {
      requireAllowedOrigin(request, headers)
      if (request.method !== "POST") throw new HttpError(405, "METHOD_NOT_ALLOWED", "Use POST for this endpoint.")
      const body = await readJson(request)

      if (body.action === "prepare") {
        const user = await authenticateRequest(request, {
          supabaseUrl: environment.SUPABASE_URL,
          anonKey: environment.SUPABASE_ANON_KEY,
          fetchImpl,
        })
        const input = prepareInput(body, user)
        const operation = await repository.createOperation({
          ...input,
          reference: createOperationReference(),
        })
        const availability = operation.availabilityStatus === "available"
          ? { status: "available", provider: operation.vendingRoute?.provider ?? null }
          : await vendingRouter.checkAvailability(operation.reference)
        return jsonResponse({ ...publicOperation(await repository.getOperation(operation.reference)), availability }, 200, headers)
      }

      if (body.action === "status") {
        const user = await authenticateRequest(request, {
          supabaseUrl: environment.SUPABASE_URL,
          anonKey: environment.SUPABASE_ANON_KEY,
          fetchImpl,
        })
        const reference = operationReference(body.operationReference ?? body.operation_reference)
        const operation = requireOwnedOperation(await repository.getOperation(reference), user)
        return jsonResponse(publicOperation(operation), 200, headers)
      }

      if (body.action === "dispatch") {
        const user = await authenticateRequest(request, {
          supabaseUrl: environment.SUPABASE_URL,
          anonKey: environment.SUPABASE_ANON_KEY,
          fetchImpl,
        })
        const reference = operationReference(body.operationReference ?? body.operation_reference)
        requireOwnedOperation(await repository.getOperation(reference), user)
        const active = await repository.getActiveVendAttempt(reference)
        const result = active
          ? await vendingRouter.reconcileVend(reference)
          : await vendingRouter.vendPaidOperation(reference)
        return jsonResponse(result, 200, headers)
      }

      if (body.action === "process") {
        requireInternalRequest(request, environment.TOPUP_INTERNAL_ROUTER_KEY)
        const reference = operationReference(body.operationReference ?? body.operation_reference)
        const active = await repository.getActiveVendAttempt(reference)
        const result = active
          ? await vendingRouter.reconcileVend(reference)
          : await vendingRouter.vendPaidOperation(reference)
        return jsonResponse(result, 200, headers)
      }

      throw new HttpError(400, "INVALID_ACTION", "Vending action is invalid.")
    } catch (error) {
      return errorResponse(error, headers)
    }
  }
}
