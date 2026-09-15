function bytesToHex(bytes) {
  return [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("")
}

function constantTimeEqual(left, right) {
  const normalizedLeft = String(left ?? "").toLowerCase()
  const normalizedRight = String(right ?? "").toLowerCase()
  if (normalizedLeft.length !== normalizedRight.length) return false
  let difference = 0
  for (let index = 0; index < normalizedLeft.length; index += 1) {
    difference |= normalizedLeft.charCodeAt(index) ^ normalizedRight.charCodeAt(index)
  }
  return difference === 0
}

export async function hmacSha512Hex(secret, rawBody) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  )
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody))
  return bytesToHex(new Uint8Array(digest))
}

export async function sha256Hex(rawBody) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rawBody))
  return bytesToHex(new Uint8Array(digest))
}

export async function verifyMonnifySignature({ secret, rawBody, signature }) {
  const expected = await hmacSha512Hex(secret, rawBody)
  return constantTimeEqual(expected, signature)
}
