import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function RefundPage() {
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
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl mb-6">Refund Policy</h1>

          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p className="text-sm">
              <strong>Last updated:</strong> June 1, 2026
            </p>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">1. Airtime and Data Top-Ups</h2>
              <p className="text-sm leading-relaxed">
                Once airtime or data has been successfully delivered to the recipient&apos;s phone number, refunds are generally not possible. If a top-up fails, the amount will be refunded to your payment method.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">2. Bill Payments</h2>
              <p className="text-sm leading-relaxed">
                For electricity, internet, and TV subscription payments, refunds depend on the service provider&apos;s policy. If a payment fails to be processed by the provider, we will refund your payment.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">3. AI Credits</h2>
              <p className="text-sm leading-relaxed">
                AI credits are non-refundable once purchased. Credits have no cash value and cannot be exchanged for money.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">4. Processing Time</h2>
              <p className="text-sm leading-relaxed">
                Eligible refunds are typically processed within 5-7 business days. The time it takes for the refund to appear in your account depends on your payment provider.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">5. How to Request a Refund</h2>
              <p className="text-sm leading-relaxed">
                To request a refund, please contact our support team at{" "}
                <a href="mailto:info@choyis.com" className="text-primary hover:underline">info@choyis.com</a>{" "}
                with your transaction details. Include your order number and a description of the issue.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">6. Contact Us</h2>
              <p className="text-sm leading-relaxed">
                If you have any questions about this Refund Policy, please visit our{" "}
                <Link href="/support" className="text-primary hover:underline">Support page</Link>{" "}
                or email us at{" "}
                <a href="mailto:info@choyis.com" className="text-primary hover:underline">info@choyis.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
