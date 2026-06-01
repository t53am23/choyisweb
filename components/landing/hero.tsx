"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Check, ChevronDown, Smartphone, Globe, Zap, Wifi, Tv, Sparkles, ShieldCheck } from "lucide-react"

const services = [
  { 
    id: "airtime", 
    icon: Smartphone, 
    label: "Airtime",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-500",
    selectedBg: "bg-emerald-100",
    borderColor: "border-emerald-200"
  },
  { 
    id: "data", 
    icon: Globe, 
    label: "Data",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
    selectedBg: "bg-blue-100",
    borderColor: "border-blue-200"
  },
  { 
    id: "electricity", 
    icon: Zap, 
    label: "Electricity",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-500",
    selectedBg: "bg-amber-100",
    borderColor: "border-amber-200"
  },
  { 
    id: "internet", 
    icon: Wifi, 
    label: "Internet",
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-500",
    selectedBg: "bg-cyan-100",
    borderColor: "border-cyan-200"
  },
  { 
    id: "tv", 
    icon: Tv, 
    label: "TV",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500",
    selectedBg: "bg-purple-100",
    borderColor: "border-purple-200"
  },
  { 
    id: "ai", 
    icon: Sparkles, 
    label: "AI",
    bgColor: "bg-teal-50",
    iconColor: "text-teal-500",
    selectedBg: "bg-teal-100",
    borderColor: "border-teal-200"
  },
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
    <section className="relative pt-20 pb-8 md:pt-24 md:pb-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 items-start">
          {/* Left: Copy */}
          <div className="max-w-xl pt-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 mb-4">
              <Check className="h-3 w-3" />
              One account. Everything you need.
            </div>

            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
              Pay bills, buy data, and access powerful AI from{" "}
              <span className="text-blue-600">one account</span>
            </h1>

            <p className="mt-4 text-muted-foreground">
              Top up airtime, buy data, pay bills, and access multiple AI models - all in one secure account.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Explore Services
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                No long signup
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Verify when needed
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Secure checkout with Paystack and Stripe
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Instant confirmation
              </span>
            </div>
          </div>

          {/* Right: Task-First Onboarding Card + Recent Activity */}
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-4">
            {/* Premium Onboarding Card with Blue Glow */}
            <div className="flex-1 rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_8px_40px_-12px_rgba(59,130,246,0.25)] relative">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 via-transparent to-cyan-50/30 pointer-events-none" />
              
              <div className="relative">
                <h3 className="text-lg font-semibold text-foreground mb-5">Start your top-up</h3>

                {/* Country Selector */}
                <div className="mb-4">
                  <label className="text-sm text-muted-foreground mb-2 block">Select country</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="w-full flex items-center justify-between rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="font-medium">{selectedCountry.name}</span>
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {showCountryDropdown && (
                      <div className="absolute z-10 mt-2 w-full rounded-xl border border-border bg-white shadow-xl">
                        {countries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country)
                              setShowCountryDropdown(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                          >
                            <span className="text-lg">{country.flag}</span>
                            <span>{country.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone/Email Input */}
                <div className="mb-5">
                  <label className="text-sm text-muted-foreground mb-2 block">Phone number or email</label>
                  <Input
                    type="text"
                    placeholder="080 1234 5678 or you@example.com"
                    className="h-12 rounded-xl border-slate-200 bg-white px-4 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Service Selection with Color-Coded Icons */}
                <div className="mb-5">
                  <label className="text-sm text-muted-foreground mb-3 block">Choose service</label>
                  <div className="grid grid-cols-3 gap-3">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setSelectedService(service.id)}
                        className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                          selectedService === service.id
                            ? `${service.borderColor} ${service.selectedBg}`
                            : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className={`w-11 h-11 rounded-xl ${service.bgColor} flex items-center justify-center`}>
                          <service.icon className={`h-5 w-5 ${service.iconColor}`} />
                        </div>
                        <span className="text-xs font-medium text-foreground">{service.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Continue Button - Strong Blue Gradient */}
                <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium text-base rounded-xl shadow-lg shadow-blue-500/25">
                  Continue
                </Button>

                {/* Secure Checkout Note */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Secure checkout</span>
                  <span className="text-slate-300">•</span>
                  <span>Multiple payment options</span>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="lg:w-52 rounded-xl border border-border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-medium text-foreground">Recent activity</h4>
                <button className="text-xs text-blue-600 hover:underline">View all</button>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">MTN Data Bundle</span>
                    <span className="text-xs text-emerald-500 font-medium">Delivered</span>
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
                    <Sparkles className="h-3.5 w-3.5 text-teal-500" />
                    <span className="text-xs text-muted-foreground">AI Credits</span>
                  </div>
                  <span className="text-sm font-semibold">2,450</span>
                </div>

                <button className="w-full text-xs text-blue-600 hover:underline text-left">
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
