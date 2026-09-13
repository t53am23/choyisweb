# Utilities rollout plan

The web dashboard will reuse the existing Supabase project, transaction tables, Paystack account, and VTpass account. The mobile app and EstatePoint web remain unchanged.

## Delivery order

1. **Shared utilities foundation — done**
   - One typed checkout interface for airtime, data, electricity, TV, and internet.
   - One Supabase browser client using only the public project URL and publishable key.
   - Paystack and VTpass secret keys stay in Supabase Edge Function secrets.
2. **Airtime vertical — frontend done, deployment gate open**
   - Validate network, Nigerian phone number, and amount.
   - Start Paystack in a popup, retain the pending reference, and resume confirmation safely.
   - Never dispatch airtime until the server has independently verified Paystack.
3. **Generalize the same secure server workflow**
   - Reuse the hardened `topup-checkout` implementation already present in the Choyis source.
   - Add data plan lookup, customer verification, and the existing VTpass service identifiers behind that single server boundary.
   - Do not create separate payment integrations per utility page.
4. **Live history and Buy Again**
   - Read successful purchases from the existing `transaction_items` table.
   - Selecting a recent purchase opens the matching form with its previous provider, identifier, plan, and amount prefilled; it never charges automatically.
5. **Authentication last**
   - Reuse the existing Supabase Auth project and session model.
   - Replace demo user data, protect dashboard routes, and verify row-level security before production checkout is enabled.

## Security release gates

- A valid user JWT is required.
- Paystack verification happens on the server with the secret key.
- VTpass fulfilment happens only after verified payment and uses a stable idempotency key.
- Transaction writes are scoped to the authenticated user.
- Browser code contains no Paystack secret, VTpass secret, or Supabase service-role key.

## Current live finding

The deployed project currently has `initialize-payment`, `confirm-payment`, and `vtpass-utilities`, but the hardened `topup-checkout` function returns `404`. The older VTpass function accepts a `pay` action without enforcing Paystack verification itself, so it must not be exposed as the new web checkout boundary. Deploying the reused hardened function is the next backend step before real-money Airtime testing.
