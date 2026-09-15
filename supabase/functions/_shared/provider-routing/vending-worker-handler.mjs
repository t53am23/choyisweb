import { errorResponse, HttpError, jsonResponse, readJson, requireInternalRequest } from "./edge-http.mjs"

export function createVendingWorkerHandler({ environment, repository, vendingRouter }) {
  return async function handle(request) {
    try {
      if (request.method !== "POST") throw new HttpError(405, "METHOD_NOT_ALLOWED", "Use POST for this endpoint.")
      requireInternalRequest(request, environment.TOPUP_INTERNAL_ROUTER_KEY)
      const body = await readJson(request)
      const requestedLimit = Number(body.limit ?? 10)
      const limit = Number.isSafeInteger(requestedLimit) ? Math.max(1, Math.min(requestedLimit, 25)) : 10
      const operations = await repository.claimVendJobs(limit)
      const outcomes = []

      for (const operation of operations) {
        try {
          const active = await repository.getActiveVendAttempt(operation.reference)
          const result = active
            ? await vendingRouter.reconcileVend(operation.reference)
            : await vendingRouter.vendPaidOperation(operation.reference)
          if (result.status === "delivered") {
            await repository.updateVendJob({ operationReference: operation.reference, status: "complete" })
          } else if (result.status === "failed") {
            await repository.updateVendJob({ operationReference: operation.reference, status: "failed", errorCode: "VEND_FAILED" })
          } else {
            await repository.updateVendJob({ operationReference: operation.reference, status: "pending", delaySeconds: 30 })
          }
          outcomes.push({ operationReference: operation.reference, status: result.status })
        } catch {
          await repository.updateVendJob({
            operationReference: operation.reference,
            status: "pending",
            errorCode: "VEND_RETRY_REQUIRED",
            delaySeconds: 60,
          })
          outcomes.push({ operationReference: operation.reference, status: "unknown" })
        }
      }

      return jsonResponse({ claimed: operations.length, outcomes })
    } catch (error) {
      return errorResponse(error)
    }
  }
}
