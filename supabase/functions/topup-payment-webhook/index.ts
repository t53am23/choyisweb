import { createMonnifyWebhookHandler } from "../_shared/provider-routing/monnify-webhook-handler.mjs"
import { createPaymentRouterRuntime } from "../_shared/provider-routing/router-runtime.mjs"

const environment = Deno.env.toObject()
const runtime = createPaymentRouterRuntime(environment)

Deno.serve(createMonnifyWebhookHandler({ environment, ...runtime }))
