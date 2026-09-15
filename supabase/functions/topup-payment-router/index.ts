import { createPaymentHandler } from "../_shared/provider-routing/payment-handler.mjs"
import { createPaymentRouterRuntime } from "../_shared/provider-routing/router-runtime.mjs"

const environment = Deno.env.toObject()
const runtime = createPaymentRouterRuntime(environment)

Deno.serve(createPaymentHandler({ environment, ...runtime }))
