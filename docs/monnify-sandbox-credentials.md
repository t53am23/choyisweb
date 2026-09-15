# Monnify Sandbox credential check

Checked against Monnify's official documentation on 2026-09-15.

- Monnify Checkout is not an anonymous or credential-free service. A merchant account must supply its Sandbox API Key and Contract Code to the official Web/Android Checkout SDK.
- "No server authentication needed" for the Web Checkout SDK means the browser does not perform the API-key/secret-key token exchange. It does not mean that no merchant credentials are required.
- The server-side transaction verification used by TOPUP requires the merchant's Sandbox API Key and Sandbox Secret Key. The Secret Key remains in Supabase only.
- Sandbox and live API keys, secret keys, contract codes, and base URLs are separate. They must not be interchanged.

Primary sources:

- [Monnify Accept Payments Quickstart](https://developers.monnify.com/docs/collections/quickstart)
- [Monnify Checkout Page](https://developers.monnify.com/docs/collections/one-time-payments/checkout-page)
- [Monnify Going Live](https://developers.monnify.com/docs/live)
- [Monnify Sandbox Test Cards](https://developers.monnify.com/docs/test-cards)
