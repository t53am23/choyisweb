# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People in Nigeria buying airtime, data, electricity, internet and television services for themselves or others. The product must also remain usable for people with low vision, reading difficulty, motor limitations, or a preference for voice-assisted interaction.

## Product Purpose

Choyis TopUp provides a fast, reliable place to discover a supported utility, verify the recipient or account when required, pay securely, receive the service, and recover the transaction or receipt.

## Positioning

One transaction workspace accepts direct service selection, repeat purchase and future AI/voice requests without creating separate checkout implementations.

## Operating Context

Customers commonly arrive on mobile devices, may be paying urgently, may not have an account, and need large readable controls, recognizable service categories, clear verification and a recoverable transaction reference.

## Capabilities and Constraints

- Existing utility catalogue and verification data comes through secure Supabase Edge Functions backed by VTpass.
- Existing Airtime and Data checkout uses the provider-routing backend and creates an internal operation reference before payment.
- OPay is the planned primary payment provider, with Paystack as fallback; Monnify may be added without changing the customer-facing flow.
- Payment collection and bill vending remain separate backend concerns.
- Provider secrets must never be exposed to browser code.
- This isolated application must not modify the existing TOPUP application or deployed Edge Functions.
- International Airtime requires a secure server-side country, product type, operator and variation sequence before it can be enabled.

## Brand Commitments

- Product name: Choyis TopUp.
- Keep the existing blue/teal identity while raising the execution to an international payment-product standard.
- Text and controls must remain comfortably readable; do not imitate Paytm's smaller typography.
- Service icons should be distinctive, consistent and recognizable without copying third-party branded artwork.

## Evidence on Hand

- Existing working utility components and catalogue clients in the parent TOPUP repository.
- Existing Supabase configuration supplied through environment variables.
- Existing receipt and transaction work in the parent repository.
- No customer counts, speed benchmarks or commercial guarantees are available and none may be invented.

## Product Principles

- Let the customer start the real task immediately.
- Use one checkout model across entry points.
- Show only live or explicitly unavailable provider data.
- Explain status and recovery before asking the customer to trust payment.
- Accessibility is part of the core transaction design.

## Accessibility & Inclusion

Use a minimum 16px body size, 18px important supporting text, large touch targets, visible keyboard focus, semantic labels, reduced-motion support and status messages that do not rely on colour alone.
