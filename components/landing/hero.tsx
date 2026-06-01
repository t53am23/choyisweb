"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Check, ChevronDown, Smartphone, Globe, Zap, Wifi, Tv, Sparkles } from "lucide-react"

const services = [
  { id: "airtime", icon: Smartphone, label: "Airtime" },
  { id: "data", icon: Globe, label: "Data" },
  { id: "electricity", icon: Zap, label: "Electricity" },
  { id: "internet", icon: Wifi, label: "Internet" },
  { id: "tv", icon: Tv, label: "TV" },
  { id: "ai", icon: Sparkles, label: "AI" },
]

const countries = [
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
]

export function Hero() {
  const [selectedCountry, setSelectedCountry] = React.useState(countries[0])
  const [selectedService, setSelectedService] = React.useState<string | null>(null)
  const [showCountryDropdown, setShowCountryDropdown] = React.useState(false)

  return (
    <section className="relative pt-20 pb-8 md:pt-24 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 items-start">
          {/* Left: Copy */}
          <div className="max-w-xl pt-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--service-airtime-bg)] px-3 py-1 text-xs font-medium text-[var(--service-airtime)] mb-4">
              <Check className="h-3 w-3" />
              One account. Everything you need
            </div>

            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
              Pay bills, buy data, and access powerful AI from{" "}
              <span className="text-primary">one account</span>
            </h1>

            <p className="mt-4 text-muted-foreground">
              Top up airtime, buy data, pay bills, and access multiple AI models - all in one secure account
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Explore Services
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[var(--service-airtime)]" />
                No long signup
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[var(--service-airtime)]" />
                Verify when needed
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[var(--service-airtime)]" />
                Secure checkout with Paystack and Stripe
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[var(--service-airtime)]" />
                Instant confirmation
              </span>
            </div>
          </div>

          {/* Right: Task-First Onboarding Card + Recent Activity */}
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-4">
            {/* Onboarding Card */}
            <div className="flex-1 rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="text-sm font-medium text-foreground mb-4">Start your top-up</h3>

              {/* Country Selector */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-1.5 block">Select country</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 text-sm hover:border-primary/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>{selectedCountry.flag}</span>
                      <span>{selectedCountry.name}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {showCountryDropdown && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country)
                            setShowCountryDropdown(false)
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone/Email Input */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-1.5 block">Phone number or email</label>
                <Input
                  type="text"
                  placeholder="080 1234 5678 or you@example.com"
                  className="bg-background"
                />
              </div>

              {/* Service Selection */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-1.5 block">Choose service</label>
                <div className="grid grid-cols-3 gap-2">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service.id)}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all ${
                        selectedService === service.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-background hover:border-primary/30"
                      }`}
                    >
                      <service.icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{service.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Continue Button */}
              <Button className="w-full bg-primary hover:bg-primary/90">
                Continue
              </Button>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Secure checkout • Multiple payment options
              </p>
            </div>

            {/* Recent Activity Card */}
            <div className="lg:w-52 rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-medium text-foreground">Recent activity</h4>
                <button className="text-xs text-primary hover:underline">View all</button>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">MTN Data Bundle</span>
                    <span className="text-xs text-[var(--service-airtime)]">Delivered</span>
                  </div>
                  <p className="text-xs text-muted-foreground">2 min ago</p>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Provider</span>
                  <span className="flex items-center gap-1.5 text-xs font-medium">
                    <span className="h-4 w-4 rounded bg-yellow-400 flex items-center justify-center text-[8px] font-bold text-black">M</span>
                    MTN Nigeria
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Amount</span>
                  <span className="text-sm font-semibold">₦1,500</span>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--service-ai)]" />
                    <span className="text-xs text-muted-foreground">AI Credits</span>
                  </div>
                  <span className="text-sm font-semibold">2,450</span>
                </div>

                <button className="w-full text-xs text-primary hover:underline text-left">
                  View receipts →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
