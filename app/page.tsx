import { Navigation } from "@/components/landing/navigation"
import { Hero } from "@/components/landing/hero"
import { ValueSection } from "@/components/landing/value-section"
import { ServicesSection } from "@/components/landing/services-section"
import { GlobalSection } from "@/components/landing/global-section"
import { AISection } from "@/components/landing/ai-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"
import { FloatingChatButton } from "@/components/landing/floating-chat-button"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <ValueSection />
      <ServicesSection />
      <GlobalSection />
      <AISection />
      <PricingSection />
      <HowItWorks />
      <CTASection />
      <Footer />
      <FloatingChatButton />
    </main>
  )
}
