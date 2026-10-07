import { createPaystackTransferAdapter } from "../_shared/provider-routing/paystack-transfer-adapter.mjs"
import { createTransferHandler } from "../_shared/provider-routing/transfer-handler.mjs"

const environment = Deno.env.toObject()
const providerEnvironment = String(
  environment.TOPUP_TRANSFER_ENVIRONMENT ?? environment.TOPUP_ROUTER_ENVIRONMENT ?? "sandbox",
).toLowerCase()
const environmentKey = providerEnvironment === "live" ? "LIVE" : "SANDBOX"
const secretKey = environment[`TOPUP_PAYSTACK_${environmentKey}_SECRET_KEY`] ?? environment.PAYSTACK_SECRET_KEY

const transferProvider = createPaystackTransferAdapter({
  environment: providerEnvironment,
  secretKey,
})

Deno.serve(createTransferHandler({ environment, transferProvider }))
