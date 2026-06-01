"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Smartphone, Clock, Star, Check } from "lucide-react"

const providers = [
  { id: "mtn", name: "MTN", color: "#FFCC00" },
  { id: "glo", name: "Glo", color: "#50B848" },
  { id: "airtel", name: "Airtel", color: "#E30613" },
  { id: "9mobile", name: "9mobile", color: "#006848" },
]

const quickAmounts = [100, 200, 500, 1000, 2000, 5000]

const recentNumbers = [
  { number: "0801 234 5678", provider: "MTN", name: "Self" },
  { number: "0803 456 7890", provider: "Glo", name: "Mum" },
  { number: "0705 678 9012", provider: "Airtel", name: "Brother" },
]

export default function AirtimePage() {
  const [selectedProvider, setSelectedProvider] = React.useState(providers[0])
  const [showProviderDropdown, setShowProviderDropdown] = React.useState(false)
  const [amount, setAmount] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Smartphone className="h-6 w-6 text-[var(--service-airtime)]" />
          Buy Airtime
        </h1>
        <p className="text-sm text-muted-foreground">Top up airtime instantly</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Airtime Top-Up</CardTitle>
              <CardDescription>Enter details to top up airtime</CardDescription>
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

              {/* Quick Amounts */}
              <div className="space-y-2">
                <Label>Quick Amount</Label>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt.toString())}
                      className={`rounded-lg border p-3 text-sm font-medium transition-all ${
                        amount === amt.toString()
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-background hover:border-primary/30"
                      }`}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Or Enter Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-background"
                />
              </div>

              {/* Summary */}
              {amount && (
                <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">₦{Number(amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-medium text-[var(--service-airtime)]">Free</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold">₦{Number(amount).toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                className="w-full bg-[var(--service-airtime)] hover:bg-[var(--service-airtime)]/90 text-white"
                disabled={!amount || !phoneNumber}
              >
                Buy Airtime
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
          <Card className="bg-[var(--service-airtime-bg)] border-[var(--service-airtime)]/20">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[var(--service-airtime)]" />
                  <span className="text-sm">Instant delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[var(--service-airtime)]" />
                  <span className="text-sm">No extra fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[var(--service-airtime)]" />
                  <span className="text-sm">24/7 availability</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
