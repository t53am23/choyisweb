"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Globe, Clock, Star, Check } from "lucide-react"

const providers = [
  { id: "mtn", name: "MTN", color: "#FFCC00" },
  { id: "glo", name: "Glo", color: "#50B848" },
  { id: "airtel", name: "Airtel", color: "#E30613" },
  { id: "9mobile", name: "9mobile", color: "#006848" },
]

const dataPlans = {
  mtn: [
    { id: "1", name: "500MB", validity: "30 days", price: 500 },
    { id: "2", name: "1GB", validity: "30 days", price: 1000 },
    { id: "3", name: "2GB", validity: "30 days", price: 1500 },
    { id: "4", name: "3GB", validity: "30 days", price: 2000 },
    { id: "5", name: "5GB", validity: "30 days", price: 3000 },
    { id: "6", name: "10GB", validity: "30 days", price: 5000 },
  ],
  glo: [
    { id: "1", name: "500MB", validity: "14 days", price: 500 },
    { id: "2", name: "1.35GB", validity: "14 days", price: 1000 },
    { id: "3", name: "2.9GB", validity: "30 days", price: 1500 },
    { id: "4", name: "4.1GB", validity: "30 days", price: 2000 },
    { id: "5", name: "7.7GB", validity: "30 days", price: 3000 },
    { id: "6", name: "10GB", validity: "30 days", price: 5000 },
  ],
  airtel: [
    { id: "1", name: "500MB", validity: "30 days", price: 500 },
    { id: "2", name: "1GB", validity: "30 days", price: 1000 },
    { id: "3", name: "2GB", validity: "30 days", price: 1500 },
    { id: "4", name: "3GB", validity: "30 days", price: 2000 },
    { id: "5", name: "4.5GB", validity: "30 days", price: 3000 },
    { id: "6", name: "10GB", validity: "30 days", price: 5000 },
  ],
  "9mobile": [
    { id: "1", name: "500MB", validity: "30 days", price: 500 },
    { id: "2", name: "1GB", validity: "30 days", price: 1000 },
    { id: "3", name: "1.5GB", validity: "30 days", price: 1500 },
    { id: "4", name: "2GB", validity: "30 days", price: 2000 },
    { id: "5", name: "3GB", validity: "30 days", price: 2500 },
    { id: "6", name: "5GB", validity: "30 days", price: 3500 },
  ],
}

const recentNumbers = [
  { number: "0801 234 5678", provider: "MTN", name: "Self" },
  { number: "0803 456 7890", provider: "Glo", name: "Mum" },
]

export default function DataPage() {
  const [selectedProvider, setSelectedProvider] = React.useState(providers[0])
  const [showProviderDropdown, setShowProviderDropdown] = React.useState(false)
  const [selectedPlan, setSelectedPlan] = React.useState<typeof dataPlans.mtn[0] | null>(null)
  const [phoneNumber, setPhoneNumber] = React.useState("")

  const currentPlans = dataPlans[selectedProvider.id as keyof typeof dataPlans]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Globe className="h-6 w-6 text-[var(--service-data)]" />
          Buy Data
        </h1>
        <p className="text-sm text-muted-foreground">Purchase data bundles for any network</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Bundle</CardTitle>
              <CardDescription>Select network and data plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Provider Selection */}
              <div className="space-y-2">
                <Label>Network Provider</Label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                    className="w-full flex items-center justify-between rounded-lg border border-input bg-background px-4 py-3 hover:border-primary/50 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: selectedProvider.color }}
                      >
                        {selectedProvider.name[0]}
                      </span>
                      <span className="font-medium">{selectedProvider.name}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {showProviderDropdown && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
                      {providers.map((provider) => (
                        <button
                          key={provider.id}
                          type="button"
                          onClick={() => {
                            setSelectedProvider(provider)
                            setShowProviderDropdown(false)
                            setSelectedPlan(null)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <span
                            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: provider.color }}
                          >
                            {provider.name[0]}
                          </span>
                          <span className="font-medium">{provider.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0801 234 5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-background"
                />
              </div>

              {/* Data Plans */}
              <div className="space-y-2">
                <Label>Select Data Plan</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {currentPlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan)}
                      className={`rounded-lg border p-3 text-left transition-all ${
                        selectedPlan?.id === plan.id
                          ? "border-[var(--service-data)] bg-[var(--service-data)]/5"
                          : "border-border bg-background hover:border-[var(--service-data)]/30"
                      }`}
                    >
                      <p className="font-semibold text-foreground">{plan.name}</p>
                      <p className="text-xs text-muted-foreground">{plan.validity}</p>
                      <p className="text-sm font-medium text-[var(--service-data)] mt-1">₦{plan.price.toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {selectedPlan && (
                <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data Plan</span>
                    <span className="font-medium">{selectedPlan.name} ({selectedPlan.validity})</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-medium text-[var(--service-airtime)]">Free</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold">₦{selectedPlan.price.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                className="w-full bg-[var(--service-data)] hover:bg-[var(--service-data)]/90 text-white"
                disabled={!selectedPlan || !phoneNumber}
              >
                Buy Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Recent Numbers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Recent Numbers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentNumbers.map((item) => (
                  <button
                    key={item.number}
                    type="button"
                    onClick={() => setPhoneNumber(item.number.replace(/\s/g, ""))}
                    className="w-full flex items-center justify-between rounded-lg border border-border p-3 hover:border-primary/30 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.number}</p>
                      <p className="text-xs text-muted-foreground">{item.name} • {item.provider}</p>
                    </div>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-[var(--service-data-bg)] border-[var(--service-data)]/20">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[var(--service-data)]" />
                  <span className="text-sm">Instant activation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[var(--service-data)]" />
                  <span className="text-sm">Best data rates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[var(--service-data)]" />
                  <span className="text-sm">All networks supported</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
