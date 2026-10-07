# Choyis TopUp product context

## Product

Choyis TopUp is a responsive web dashboard for Nigerian users to buy airtime, data and utilities, keep receipts and transaction history, and eventually access AI-assisted services from the same Choyis account used across web and mobile.

## Users and jobs

- People who want a quick, readable way to top up or pay a bill.
- Returning users who want saved history, receipts and repeat purchases.
- Users who benefit from clear language, generous touch targets and future voice-assisted flows.
- Transfer users who need to select a real Nigerian bank, verify the recipient and review the transfer before money can move.

## Positioning

Simple, trustworthy and premium rather than crowded. Choyis should feel like one coherent service layer even when multiple payment or vending providers operate behind it.

## Confirmed architecture and constraints

- Provider lists, product catalogues and bank data must come from provider APIs; do not hardcode them.
- Provider credentials and routing stay in Supabase Edge Functions or other server-only code.
- VTpass remains the current vending integration and must not be changed by transfer work.
- Existing Airtime, Data, Electricity, Internet, TV and related flows must remain intact.
- Paystack is the current primary payment integration. OPay can be introduced only after the required product and live access are confirmed.
- A transfer must not spend the Choyis merchant balance until a legitimate sender funding and authorization model exists.
- Do not test money movement with live credentials.
- Payment and vending remain separate domains.
- Operations that move money must be authenticated, idempotent and auditable.

## Visual principles

- Reuse the existing Choyis design system, typography, cards, controls and responsive dashboard shell.
- Keep service entry points easy to scan on desktop and mobile.
- Use clear state changes for loading, verification, review, pending, failure and success.
- Never imply that a recipient is verified until the server confirms the account name.

## Evidence

This context is based on the current dashboard and provider-router implementation, the existing utility checkout flow, and the product constraints confirmed in this task.
