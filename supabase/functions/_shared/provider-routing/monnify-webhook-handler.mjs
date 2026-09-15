import { errorResponse, HttpError, jsonResponse } from "./edge-http.mjs"
import { sha256Hex, verifyMonnifySignature } from "./webhook-security.mjs"

function requiredSecret(environment, environmentName) {
  const name = `TOPUP_MONNIFY_${environmentName.toUpperCase()}_SECRET_KEY`
  const value = String(environment[name] ?? "").trim()
  if (!value) throw new Error(`${name} is required.`)
  return value
}

function safeEventPayload(body) {
  return {
    eventType: String(body.eventType ?? "unknown"),
    paymentReference: body.eventData?.paymentReference ?? null,
    transactionReference: body.eventData?.transactionReference ?? null,
  }
}

export function createMonnifyWebhookHandler({ environment, repository, paymentRouter }) {
  return async function handle(request) {
    try {
      if (request.method !== "POST") throw new HttpError(405, "METHOD_NOT_ALLOWED", "Use POST for this endpoint.")
      const rawBody = await request.text()
      if (new TextEncoder().encode(rawBody).byteLength > 65_536) {
        throw new HttpError(413, "REQUEST_TOO_LARGE", "Request is too large.")
      }

      const environmentName = String(environment.TOPUP_ROUTER_ENVIRONMENT ?? "").toLowerCase()
      if (!new Set(["sandbox", "live"]).has(environmentName)) {
        throw new Error("TOPUP_ROUTER_ENVIRONMENT must be sandbox or live.")
      }
      const signature = request.headers.get("monnify-signature")
      if (environmentName === "live" || signature) {
        const valid = signature && await verifyMonnifySignature({
          secret: requiredSecret(environment, environmentName),
          rawBody,
          signature,
        })
        if (!valid) throw new HttpError(401, "INVALID_SIGNATURE", "Webhook signature is invalid.")
      }

      let body
      try {
        body = JSON.parse(rawBody)
      } catch {
        throw new HttpError(400, "INVALID_JSON", "Webhook body must be valid JSON.")
      }
      const paymentReference = String(body.eventData?.paymentReference ?? "").trim()
      if (!paymentReference) throw new HttpError(400, "INVALID_EVENT", "Webhook payment reference is missing.")

      const operation = await repository.getOperationByPaymentReference(paymentReference)
      const bodyHash = await sha256Hex(rawBody)
      const transactionReference = String(body.eventData?.transactionReference ?? "").trim()
      const eventKey = `${String(body.eventType ?? "UNKNOWN")}:${transactionReference || paymentReference}`
      const inserted = await repository.recordProviderEvent({
        provider: "monnify",
        eventKey,
        operationReference: operation?.reference ?? null,
        bodyHash,
        payload: safeEventPayload(body),
      })

      if (!operation) {
        await repository.updateProviderEventStatus({ provider: "monnify", eventKey, status: "ignored" })
        return jsonResponse({ accepted: true, matched: false })
      }
      if (!inserted && operation.paymentStatus === "paid") {
        return jsonResponse({ accepted: true, duplicate: true })
      }

      const result = await paymentRouter.reconcilePayment(operation.reference)
      await repository.updateProviderEventStatus({
        provider: "monnify",
        eventKey,
        status: result.status === "paid" ? "processed" : "received",
      })
      return jsonResponse({ accepted: true, status: result.status })
    } catch (error) {
      return errorResponse(error)
    }
  }
}
