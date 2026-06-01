import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl mb-6">Privacy Policy</h1>

          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p className="text-sm">
              <strong>Last updated:</strong> June 1, 2026
            </p>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">1. Information We Collect</h2>
              <p className="text-sm leading-relaxed">
                We collect information you provide directly to us, including your name, email address, phone number, country, and payment information. We also collect information about your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">2. How We Use Your Information</h2>
              <p className="text-sm leading-relaxed">
                We use your information to provide, maintain, and improve our services, process transactions, send notifications, and communicate with you about your account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">3. Information Sharing</h2>
              <p className="text-sm leading-relaxed">
                We do not sell your personal information. We may share your information with service providers who assist us in operating our platform, including payment processors (Paystack, Stripe) and service fulfillment partners.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">4. Data Security</h2>
              <p className="text-sm leading-relaxed">
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">5. Your Rights</h2>
              <p className="text-sm leading-relaxed">
                You have the right to access, update, or delete your personal information. You can do this through your account settings or by contacting us directly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-foreground mb-2">6. Contact Us</h2>
              <p className="text-sm leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:info@choyis.com" className="text-primary hover:underline">info@choyis.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
