# Choyis TopUp provider routers

This folder is owned by the standalone TopUp web project. It does not replace or modify the existing EstatePoint or Android integrations.

## Flow

1. `topup-vending-router` creates an idempotent operation and validates the requested airtime/data product against VTpass.
2. `topup-payment-router` creates a provider attempt and returns public Monnify Web SDK configuration.
3. The browser opens the official `monnify-ts` checkout. Its callback only triggers a server requery.
4. `topup-payment-webhook` verifies the production signature when present/required, deduplicates the notification, then independently verifies status, reference, currency, and exact amount with Monnify.
5. The database queues one vend job after authoritative payment confirmation. `topup-vending-worker`, or the authenticated dispatch route for an immediate foreground result, performs vending independently.
6. Pending/unknown payment and vending attempts are always requeried with the same provider reference. Fallback is allowed only after a definitive result proves no charge or fulfilment could have occurred.

## Enabled providers

- Payment: Monnify first; Paystack can be explicitly enabled as fallback.
- OPay: fail-closed and not implemented until an approved Online Gateway contract is available.
- Vending: VTpass only.
- Monnify Bills: fail-closed until the merchant Bills account is activated and its adapter passes Sandbox tests.

## Sandbox deployment checklist

1. Review and apply `migrations/20260915120000_topup_provider_routers.sql` to the intended Supabase project.
2. Add the server-only secrets listed in the repository `.env.example` to Supabase Edge Function Secrets. Use only Sandbox credentials while `TOPUP_ROUTER_ENVIRONMENT=sandbox`.
3. Deploy the four `topup-*` functions. Their JWT gateway setting is disabled because each user endpoint performs an explicit Supabase Auth lookup, while webhook/worker endpoints use their own authentication.
4. Configure the Monnify Sandbox transaction webhook URL as `/functions/v1/topup-payment-webhook`.
5. Schedule `topup-vending-worker` with the internal key, or invoke it manually during the first controlled Sandbox test.
6. Run an authenticated airtime/data checkout with a Monnify Sandbox test card. Confirm one payment attempt, one vend attempt, one outbox job, and one delivered receipt/reference.

Do not configure Live keys in the Sandbox-named secrets. Live deployment uses the separate `TOPUP_*_LIVE_*` names and requires `TOPUP_ROUTER_ENVIRONMENT=live`.
