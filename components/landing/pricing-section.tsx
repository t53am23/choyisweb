"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

const plans = [
  {
    name: "Free Trial",
    description: "Try AI features",
    price: "₦0",
    period: "/month",
    features: ["Limited AI credits", "Basic chat access"],
    cta: "Start Free",
    ctaLink: "/signup",
    highlighted: false,
  },
  {
    name: "Basic AI",
    description: "For everyday AI tasks",
    price: "₦2,500",
    period: "/month",
    features: ["Included AI credits", "Access to standard models", "Extra credits available"],
    cta: "Choose Basic",
    ctaLink: "/signup?plan=basic",
    highlighted: false,
  },
  {
    name: "Pro AI",
    description: "For power users",
    price: "₦4,500",
    period: "/month",
    features: ["More AI credits", "Advanced models & Auto Mode", "Priority access", "Extra credits available"],
    cta: "Choose Pro",
    ctaLink: "/signup?plan=pro",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Team AI",
    description: "For schools, teams, and communities",
    price: "Contact Sales",
    period: "",
    features: ["Shared AI credits", "Team credit allocation", "Usage overview"],
    cta: "Contact Sales",
    ctaLink: "/support",
    highlighted: false,
  },
]

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="py-10 md:py-14 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Simple plans for services and AI
          </h2>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setIsYearly(false)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              !isYearly ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setIsYearly(true)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              isYearly ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            )}
          >
            Yearly
          </button>
          {isYearly && (
            <span className="inline-flex items-center rounded-full bg-[var(--service-airtime-bg)] px-2 py-0.5 text-xs font-medium text-[var(--service-airtime)]">
              Save up to 20%
            </span>
          )}
        </div>

        {/* Pricing cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-xl border p-4 transition-all",
                plan.highlighted
                  ? "border-primary bg-card shadow-md"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 left-4 inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                  {plan.badge}
                </span>
              )}

              <h3 className="font-semibold text-foreground">{plan.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{plan.description}</p>

              <div className="mt-3">
                <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mt-3 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-[var(--service-airtime)] shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaLink}>
                <Button
                  variant={plan.highlighted ? "default" : "outline"}
                  className={cn("mt-4 w-full", plan.highlighted && "bg-primary hover:bg-primary/90")}
                  size="sm"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="mt-5 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
          Airtime, data, bills, internet, and TV are paid securely at checkout. AI credits are only for AI usage and are not cash, not withdrawable, and not transferable
        </p>
      </div>
    </section>
  )
}
