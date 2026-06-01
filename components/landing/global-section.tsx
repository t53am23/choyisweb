"use client"

import { useState } from "react"
import { Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const countries = [
  { code: "NG", name: "Nigeria", services: ["Airtime", "Data", "Electricity", "Internet", "TV", "AI"] },
  { code: "GH", name: "Ghana", services: ["Airtime", "Data", "Electricity", "AI"] },
  { code: "KE", name: "Kenya", services: ["Airtime", "Data", "Internet", "AI"] },
  { code: "GB", name: "United Kingdom", services: ["Internet", "TV", "AI"] },
  { code: "US", name: "United States", services: ["Internet", "AI"] },
  { code: "CA", name: "Canada", services: ["Internet", "AI"] },
]

export function GlobalSection() {
  const [selected, setSelected] = useState(countries[0])

  return (
    <section className="py-10 md:py-14 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10 items-center">
          {/* Left: Copy */}
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Choose a country.<br />See what&apos;s available
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Top up and pay for supported services in your country. More countries added all the time
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="#">
                <Button variant="outline" size="sm" className="text-xs">
                  View all countries
                </Button>
              </Link>
              <Link href="#">
                <Button variant="ghost" size="sm" className="text-xs">
                  Support family & friends
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Country Selector */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Select Country</span>
            </div>

            {/* Country Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => setSelected(country)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    selected.code === country.code
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {country.name}
                </button>
              ))}
            </div>

            {/* Available services */}
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Available in {selected.name}</p>
              <div className="flex flex-wrap gap-3">
                {selected.services.map((service) => (
                  <span
                    key={service}
                    className="inline-flex items-center gap-1.5 text-xs text-foreground"
                  >
                    <Check className="h-3.5 w-3.5 text-[var(--service-airtime)]" />
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
