# AI-native TOPUP review

Reviewed on 2026-09-25. This is a read-only design and reuse assessment; no product code was changed.

## Existing CHOYISAPP behavior worth reusing

Source: `CHOYISAPP/android/app/src/main/java/com/choyis/app/TopUpMiniApp.kt`.

- The Home screen derives a recharge forecast from delivered transaction history, grouped by service and recipient.
- It requires at least two purchases on different days and uses the average interval, so it does not invent a forecast for new users.
- Forecast cards are ordered by urgency and support one-tap `Top up`/`Rebook` prefill.
- Users can correct a forecast with `Still have some` or `Already low`.
- Insights provides service, account, period, spend, purchase count, average purchase, provider breakdown and previous-period comparison.
- The microphone entry currently opens AI, but the AI transaction path is not implemented in TOPUP web.

## Do not copy literally

- Android stores forecast corrections in local `SharedPreferences`. Web and mobile would disagree. Persist forecast feedback in a TOPUP-owned Supabase table keyed by user, service and recipient.
- The forecast uses a display date string (`d MMM yyyy`). Web should calculate from canonical database timestamps.
- `daysUntil` is predicted time until the user's next likely purchase, not an actual provider balance. Label it `Estimated` and never claim actual remaining airtime, data or electricity units unless a provider response supplies that field.
- The current TOPUP web dashboard uses hardcoded name, credits, totals and transactions. These cannot feed AI or Insights and must be replaced by authenticated live queries before release.

## Recommended web information architecture

1. Home: one `Ask Choyis` command bar, urgent recharge carousel, service shortcuts and two recent transactions.
2. History: searchable live orders and receipts, with Buy again.
3. Insights: historical spend, cadence, provider/account breakdown and user-corrected forecasts.
4. AI: a full conversation workspace for general AI and transaction assistance.

The command bar can accept requests such as `Buy the same MTN data I bought last time`. AI prepares a typed purchase draft through the same backend router as the normal form. It must show recipient, provider, plan, amount and fees and wait for explicit confirmation. AI must never bypass payment verification or vending idempotency.

## Best references

### 1. Finapt — best single reference for the combined product

Finapt combines a Nigerian AI money assistant, transaction actions, bills, spending reports, charts, recurring plans and a conventional dashboard. It is the closest reference for how TOPUP can combine AI, utilities and Insights without becoming a chat-only product.

Source: <https://withfinapt.com/>

### 2. GOBie — best reference for conversational transaction safety

GOBie prepares transactions in chat, resolves saved recipients, shows a precise confirmation, requires PIN approval and returns a receipt in the conversation. TOPUP should follow this prepare-review-confirm pattern.

Source: <https://gob.ng/gobie/>

### 3. BuyPower — best reference for utility trust and records

BuyPower is still the stronger reference for reminders, meter consumption history, transaction history, tokens and downloadable utility receipts.

Sources:

- <https://blog.buypower.ng/buypower-mobile-app/>
- <https://blog.buypower.ng/track-bills-buypower/>

### 4. WhatsApp Bill Payments — best reference for repeat-payment home design

WhatsApp's 2026 bill-payment design surfaces upcoming bills, multiple accounts per biller, previously paid billers and popular categories on Payments Home for one-tap access.

Source: <https://about.fb.com/news/2026/09/launching-bill-payments-in-india-helping-people-to-pay-everyday-household-bills-directly-on-whatsapp/>

### 5. MTN Zigi — useful telecom-specific AI reference

Zigi uses conversational flows for balance checks, airtime, bundles, account management, personalised offers and renewal/churn prevention.

Source: <https://www.mtn.ng/software-labs/zigi>

## Current trend and safety boundary

The direction is agentic commerce, but current payment standards emphasize provable user intent and explicit authorization. Choyis should start with an assisted-agent model: AI understands and prepares; the user reviews and authorizes; the existing backend verifies payment and performs vending.

Sources:

- Google Agent Payments Protocol: <https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol>
- Visa Trusted Agent Protocol: <https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-unveils-trusted-agent-protocol-for-ai-commerce.html>
- Mastercard Verifiable Intent: <https://www.mastercard.com/content/mccom/eeu-language-masters/en_ge/news-and-trends/stories/2026/verifiable-intent.html>

## Recommended implementation order

1. Replace dashboard mock data with authenticated TOPUP transaction queries.
2. Port the forecast algorithm as a tested shared TypeScript domain module.
3. Add server-side forecast feedback so Android and web can share corrections later without changing the Android app now.
4. Add the urgent recharge carousel and Buy again prefill to web Home.
5. Add the historical Insights page using the same live transaction source.
6. Add AI intent parsing that produces a purchase draft only.
7. Connect the draft to the existing review/payment/vending router with explicit user confirmation.
8. Add OPay only as a separate Sandbox payment adapter after its official integration and webhook verification are confirmed. Do not place OPay secrets in browser code.
