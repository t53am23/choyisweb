import { createPaymentRouter } from "./payment-router.mjs"
import {
  createPaymentProviderConfiguration,
  createVendingProviderConfiguration,
} from "./provider-config.mjs"
import { createSupabaseRouterRepository } from "./supabase-router-repository.mjs"
import { createVendingRouter } from "./vending-router.mjs"

function createRepository(environment, fetchImpl) {
  return createSupabaseRouterRepository({
    supabaseUrl: environment.SUPABASE_URL,
    serviceRoleKey: environment.SUPABASE_SERVICE_ROLE_KEY,
    fetchImpl,
  })
}

export function createPaymentRouterRuntime(environment, fetchImpl = fetch) {
  const repository = createRepository(environment, fetchImpl)
  const configuration = createPaymentProviderConfiguration({ environment, fetchImpl })
  return {
    repository,
    configuration,
    paymentRouter: createPaymentRouter({ repository, providers: configuration.providers }),
  }
}

export function createVendingRouterRuntime(environment, fetchImpl = fetch) {
  const repository = createRepository(environment, fetchImpl)
  const configuration = createVendingProviderConfiguration({ environment, fetchImpl })
  return {
    repository,
    configuration,
    vendingRouter: createVendingRouter({ repository, providers: configuration.providers }),
  }
}
