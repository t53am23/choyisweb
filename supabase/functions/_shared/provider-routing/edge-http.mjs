export class HttpError extends Error {
  constructor(status, code, message) {
    super(message)
    this.name = "HttpError"
    this.status = status
    this.code = code
  }
}

export function jsonResponse(payload, status = 200, headers = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  })
}

export async function readJson(request, maximumBytes = 32_768) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0)
  if (declaredLength > maximumBytes) throw new HttpError(413, "REQUEST_TOO_LARGE", "Request is too large.")
  const raw = await request.text()
  if (new TextEncoder().encode(raw).byteLength > maximumBytes) {
    throw new HttpError(413, "REQUEST_TOO_LARGE", "Request is too large.")
  }
  try {
    return JSON.parse(raw)
  } catch {
    throw new HttpError(400, "INVALID_JSON", "Request body must be valid JSON.")
  }
}

export async function authenticateRequest(request, { supabaseUrl, anonKey, fetchImpl = fetch }) {
  const authorization = request.headers.get("authorization") ?? ""
  if (!authorization.startsWith("Bearer ")) {
    throw new HttpError(401, "AUTH_REQUIRED", "A secure login is required.")
  }
  const response = await fetchImpl(`${String(supabaseUrl).replace(/\/$/, "")}/auth/v1/user`, {
    headers: { apikey: anonKey, authorization },
  })
  const user = await response.json().catch(() => null)
  if (!response.ok || !user?.id || !user?.email) {
    throw new HttpError(401, "INVALID_SESSION", "Your secure session is invalid or expired.")
  }
  return user
}

export function requireOwnedOperation(operation, user) {
  if (!operation) throw new HttpError(404, "OPERATION_NOT_FOUND", "TopUp operation was not found.")
  if (operation.userId !== user.id) throw new HttpError(404, "OPERATION_NOT_FOUND", "TopUp operation was not found.")
  return operation
}

export function requireInternalRequest(request, expectedKey) {
  const actual = request.headers.get("x-topup-router-key") ?? ""
  const expected = String(expectedKey ?? "")
  if (!expected || actual.length !== expected.length) {
    throw new HttpError(401, "INTERNAL_AUTH_REQUIRED", "Internal authorization is required.")
  }
  let difference = 0
  for (let index = 0; index < expected.length; index += 1) {
    difference |= actual.charCodeAt(index) ^ expected.charCodeAt(index)
  }
  if (difference !== 0) throw new HttpError(401, "INTERNAL_AUTH_REQUIRED", "Internal authorization is required.")
}

export function errorResponse(error, headers = {}) {
  if (error instanceof HttpError) {
    return jsonResponse({ code: error.code, message: error.message }, error.status, headers)
  }
  console.error("TopUp router request failed", error instanceof Error ? error.name : "UnknownError")
  return jsonResponse({ code: "TOPUP_REQUEST_REJECTED", message: "The secure TopUp request could not be completed." }, 500, headers)
}

export function corsHeaders(request, environment) {
  const origin = request.headers.get("origin")
  const configured = String(environment.TOPUP_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
  const sandboxDefaults = environment.TOPUP_ROUTER_ENVIRONMENT === "sandbox"
    ? ["http://127.0.0.1:3000", "http://localhost:3000"]
    : []
  const allowed = new Set([...configured, ...sandboxDefaults])
  return {
    ...(origin && allowed.has(origin) ? { "access-control-allow-origin": origin, vary: "Origin" } : {}),
    "access-control-allow-headers": "authorization, apikey, content-type, x-client-info, x-topup-router-key",
    "access-control-allow-methods": "POST, OPTIONS",
  }
}

export function requireAllowedOrigin(request, headers) {
  if (request.headers.has("origin") && !headers["access-control-allow-origin"]) {
    throw new HttpError(403, "ORIGIN_NOT_ALLOWED", "This site is not allowed to call the TopUp service.")
  }
}
