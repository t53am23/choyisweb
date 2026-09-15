import { createVendingHandler } from "../_shared/provider-routing/vending-handler.mjs"
import { createVendingRouterRuntime } from "../_shared/provider-routing/router-runtime.mjs"

const environment = Deno.env.toObject()
const runtime = createVendingRouterRuntime(environment)

Deno.serve(createVendingHandler({ environment, ...runtime }))
