"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, ChevronDown, Clock, CheckCircle2 } from "lucide-react"

const providers = [
  { id: "spectranet", name: "Spectranet", logo: "S" },
  { id: "smile", name: "Smile", logo: "SM" },
  { id: "swift", name: "Swift", logo: "SW" },
  { id: "ipnx", name: "ipNX", logo: "IP" },
]

const plans = [
  { id: "1", name: "10GB - 30 Days", price: 5000, provider: "spectranet" },
  { id: "2", name: "25GB - 30 Days", price: 10000, provider: "spectranet" },
  { id: "3", name: "50GB - 30 Days", price: 18000, provider: "spectranet" },
  { id: "4", name: "Unlimited - 30 Days", price: 25000, provider: "spectranet" },
  { id: "5", name: "15GB - 30 Days", price: 6000, provider: "smile" },
  { id: "6", name: "30GB - 30 Days", price: 11000, provider: "smile" },
]

const recentTransactions = [
  { id: "1", plan: "25GB - 30 Days", provider: "Spectranet", amount: 10000, status: "completed", date: "Today, 2:30 PM" },
  { id: "2", plan: "15GB - 30 Days", provider: "Smile", amount: 6000, status: "completed", date: "Yesterday" },
]

export default function InternetPage() {
  const [selectedProvider, setSelectedProvider] = React.useState(providers[0])
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null)
  const [showProviderDropdown, setShowProviderDropdown] = React.useState(false)
  const [accountNumber, setAccountNumber] = React.useState("")

  const filteredPlans = plans.filter(plan => plan.provider === selectedProvider.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Internet</h1>
        <p className="text-muted-foreground">Buy internet plans from trusted providers</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-cyan-500" />
                </div>
                Buy Internet Plan
              </CardTitle>
              <CardDescription>Select a provider and plan to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Select Provider</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                    className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm hover:border-cyan-300 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-lg bg-cyan-100 flex items-center justify-center text-xs font-bold text-cyan-600">
                        {selectedProvider.logo}
                      </span>
                      <span className="font-medium">{selectedProvider.name}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {showProviderDropdown && (
                    <div className="absolute z-10 mt-2 w-full rounded-lg border border-border bg-card shadow-lg">
                      {providers.map((provider) => (
                        <button
                          key={provider.id}
                          type="button"
                          onClick={() => {
                            setSelectedProvider(provider)
                            setShowProviderDropdown(false)
                            setSelectedPlan(null)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <span className="h-8 w-8 rounded-lg bg-cyan-100 flex items-center justify-center text-xs font-bold text-cyan-600">
                            {provider.logo}
                          </span>
                          <span>{provider.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="text-sm font-medium mb-2 block">Account Number / Device ID</label>
                <Input
                  type="text"
                  placeholder="Enter your account number or device ID"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Plan Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Select Plan</label>
                <div className="grid grid-cols-2 gap-3">
                  {filteredPlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`flex flex-col items-start rounded-lg border p-4 transition-all text-left ${
                        selectedPlan === plan.id
                          ? "border-cyan-500 bg-cyan-50"
                          : "border-border hover:border-cyan-300"
                      }`}
                    >
                      <span className="text-sm font-medium">{plan.name}</span>
                      <span className="text-lg font-semibold text-cyan-600">₦{plan.price.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white"
                disabled={!selectedPlan || !accountNumber}
              >
                Continue to Payment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Internet Purchases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{tx.plan}</p>
                    <p className="text-xs text-muted-foreground">{tx.provider} • {tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">₦{tx.amount.toLocaleString()}</p>
                    <p className="text-xs text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
