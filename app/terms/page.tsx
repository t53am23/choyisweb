import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="4" className="fill-primary" />
                <circle cx="24" cy="8" r="4" className="fill-primary/60" />
                <circle cx="8" cy="24" r="4" className="fill-primary/60" />
                <circle cx="24" cy="24" r="4" className="fill-primary/40" />
              </svg>
              <span className="text-lg font-semibold text-foreground">Choyis TopUp</span>
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-10 px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl mb-6">Terms of Service</h1>

          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p className="text-sm">
              <strong>Last updated:</strong> June 1, 2026
            </p>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">1. Acceptance of Terms</h2>
              <p className="text-sm leading-relaxed">
                By accessing and using Choyis TopUp (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">2. Description of Service</h2>
              <p className="text-sm leading-relaxed">
                Choyis TopUp provides a platform for purchasing airtime, data bundles, electricity tokens, internet subscriptions, TV subscriptions, and AI credits. Services are available based on your selected country.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">3. Account Registration</h2>
              <p className="text-sm leading-relaxed">
                To use certain features of the Service, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">4. Payment Terms</h2>
              <p className="text-sm leading-relaxed">
                All purchases are processed securely through Paystack or Stripe. Prices are displayed in your local currency. By completing a transaction, you agree to pay all charges incurred.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">5. AI Credits</h2>
              <p className="text-sm leading-relaxed">
                AI credits are for AI usage only and are not cash, not withdrawable, and not transferable. Credits have no monetary value and cannot be exchanged for currency or other goods/services outside the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">6. Refund Policy</h2>
              <p className="text-sm leading-relaxed">
                Please see our <Link href="/refund" className="text-primary hover:underline">Refund Policy</Link> for details on refunds and cancellations.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">7. Contact Us</h2>
              <p className="text-sm leading-relaxed">
                If you have any questions about these Terms, please contact us at{" "}
                <a href="mailto:info@choyis.com" className="text-primary hover:underline">info@choyis.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
