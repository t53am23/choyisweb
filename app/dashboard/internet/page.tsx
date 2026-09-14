"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ChevronDown, Clock, Loader2, RefreshCw, Wifi } from "lucide-react"
import { internetProviders } from "@/lib/utilities/catalog"
import { useUtilityVariations } from "@/lib/utilities/use-utility-variations"
import type { UtilityVariation } from "@/lib/utilities/vtpass"

export default function InternetPage() {
  const [selectedProvider, setSelectedProvider] = React.useState(internetProviders[0])
  const [selectedPlan, setSelectedPlan] = React.useState<UtilityVariation | null>(null)
  const [showProviderDropdown, setShowProviderDropdown] = React.useState(false)
  const [accountNumber, setAccountNumber] = React.useState("")
  const { variations: plans, loading, error, retry } = useUtilityVariations(selectedProvider.serviceId)

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
                        {selectedProvider.badge}
                      </span>
                      <span className="font-medium">{selectedProvider.name}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {showProviderDropdown && (
                    <div className="absolute z-10 mt-2 w-full rounded-lg border border-border bg-card shadow-lg">
                      {internetProviders.map((provider) => (
                        <button
                          key={provider.serviceId}
                          type="button"
                          onClick={() => {
                            setSelectedProvider(provider)
                            setShowProviderDropdown(false)
                            setSelectedPlan(null)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <span className="h-8 w-8 rounded-lg bg-cyan-100 flex items-center justify-center text-xs font-bold text-cyan-600">
                            {provider.badge}
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
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-sm font-medium">Select Plan</label>
                  <span className="text-xs font-medium text-emerald-600">Live prices</span>
                </div>
                {loading && <div role="status" className="flex items-center justify-center gap-2 rounded-lg border border-border p-8 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading live plans…</div>}
                {!loading && error && (
                  <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
                    <div className="flex items-start gap-2 text-destructive"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></div>
                    <Button type="button" variant="outline" size="sm" className="mt-3" onClick={retry}><RefreshCw className="mr-2 h-3.5 w-3.5" /> Retry</Button>
                  </div>
                )}
                {!loading && !error && plans.length === 0 && <p className="rounded-lg border border-border p-6 text-center text-sm text-muted-foreground">No plans are available for this provider right now.</p>}
                {!loading && !error && plans.length > 0 && <div className="grid max-h-[30rem] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan)}
                      className={`flex flex-col items-start rounded-lg border p-4 transition-all text-left ${
                        selectedPlan?.id === plan.id
                          ? "border-cyan-500 bg-cyan-50"
                          : "border-border hover:border-cyan-300"
                      }`}
                    >
                      <span className="text-sm font-medium">{plan.name}</span>
                      <span className="text-lg font-semibold text-cyan-600">₦{plan.amount.toLocaleString()}</span>
                    </button>
                  ))}
                </div>}
              </div>

              <Button
                type="button"
                className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white"
                disabled
              >
                Payment connection follows the catalogue batch
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
            <CardContent><p className="text-sm text-muted-foreground">No recent purchases yet. Successful live transactions will appear here after checkout is connected.</p></CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
