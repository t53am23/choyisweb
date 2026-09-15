"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Check, ChevronDown, Clock, Globe, Loader2, RefreshCw } from "lucide-react"
import { dataProviders } from "@/lib/utilities/catalog"
import {
  confirmUtilityCheckout,
  openUtilityCheckout,
  startUtilityCheckout,
  UtilityCheckoutError,
} from "@/lib/utilities/checkout"
import { useUtilityVariations } from "@/lib/utilities/use-utility-variations"
import type { UtilityVariation } from "@/lib/utilities/vtpass"

export default function DataPage() {
  const [selectedProvider, setSelectedProvider] = React.useState(dataProviders[0])
  const [showProviderDropdown, setShowProviderDropdown] = React.useState(false)
  const [selectedPlan, setSelectedPlan] = React.useState<UtilityVariation | null>(null)
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [checkoutState, setCheckoutState] = React.useState<"idle" | "starting" | "confirming" | "delivered">("idle")
  const [checkoutError, setCheckoutError] = React.useState("")
  const [pendingOperation, setPendingOperation] = React.useState<string | null>(null)
  const idempotencyKey = React.useRef<string | null>(null)
  const { variations: currentPlans, loading, error, retry } = useUtilityVariations(selectedProvider.serviceId)

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setPendingOperation(sessionStorage.getItem("choyisweb:pending-data-transaction"))
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const handleCheckout = async () => {
    if (!selectedPlan) return
    setCheckoutError("")
    try {
      setCheckoutState("starting")
      idempotencyKey.current ||= crypto.randomUUID()
      const checkout = await startUtilityCheckout({
        serviceType: "data",
        provider: selectedProvider.serviceId,
        customerIdentifier: phoneNumber,
        amount: selectedPlan.amount,
        variationCode: selectedPlan.code,
        idempotencyKey: idempotencyKey.current,
      })
      sessionStorage.setItem("choyisweb:pending-data-transaction", checkout.operationReference)
      setPendingOperation(checkout.operationReference)
      const outcome = await openUtilityCheckout(checkout)
      if (outcome === "redirected") return
      setCheckoutState("confirming")
      const maximumChecks = outcome === "completed" ? 60 : 1
      for (let check = 0; check < maximumChecks; check += 1) {
        if (check > 0) await new Promise((resolve) => window.setTimeout(resolve, 5_000))
        const result = await confirmUtilityCheckout(checkout.operationReference)
        if (result.status === "delivered") {
          sessionStorage.removeItem("choyisweb:pending-data-transaction")
          setPendingOperation(null)
          idempotencyKey.current = null
          setCheckoutState("delivered")
          return
        }
        if (result.status === "failed") {
          throw new UtilityCheckoutError("Payment completed, but data delivery failed.", "DELIVERY_FAILED")
        }
      }
      throw new UtilityCheckoutError(
        "Payment is not confirmed yet. Your reference is saved safely for another status check.",
        "PAYMENT_PENDING",
        true,
      )
    } catch (caught) {
      setCheckoutError(caught instanceof Error ? caught.message : "Data checkout could not be completed.")
      setCheckoutState("idle")
    }
  }

  const checkPendingCheckout = async () => {
    if (!pendingOperation) return
    setCheckoutError("")
    setCheckoutState("confirming")
    try {
      const result = await confirmUtilityCheckout(pendingOperation)
      if (result.status === "delivered") {
        sessionStorage.removeItem("choyisweb:pending-data-transaction")
        setPendingOperation(null)
        idempotencyKey.current = null
        setCheckoutState("delivered")
        return
      }
      throw new UtilityCheckoutError(
        result.status === "failed" ? "This data purchase failed." : "Payment or delivery is still processing. Check again shortly.",
        result.status === "failed" ? "DELIVERY_FAILED" : "PAYMENT_PENDING",
        result.status !== "failed",
      )
    } catch (caught) {
      setCheckoutError(caught instanceof Error ? caught.message : "Status could not be checked.")
      setCheckoutState("idle")
    }
  }

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
                        {selectedProvider.badge}
                      </span>
                      <span className="font-medium">{selectedProvider.name}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {showProviderDropdown && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
                      {dataProviders.map((provider) => (
                        <button
                          key={provider.serviceId}
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
                            {provider.badge}
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
                <div className="flex items-center justify-between gap-3">
                  <Label>Select Data Plan</Label>
                  <span className="text-xs font-medium text-emerald-600">Live prices</span>
                </div>
                {loading && (
                  <div role="status" className="flex items-center justify-center gap-2 rounded-lg border border-border p-8 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading live plans…
                  </div>
                )}
                {!loading && error && (
                  <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
                    <div className="flex items-start gap-2 text-destructive"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></div>
                    <Button type="button" variant="outline" size="sm" className="mt-3" onClick={retry}>
                      <RefreshCw className="mr-2 h-3.5 w-3.5" /> Retry
                    </Button>
                  </div>
                )}
                {!loading && !error && currentPlans.length === 0 && (
                  <p className="rounded-lg border border-border p-6 text-center text-sm text-muted-foreground">No plans are available for this provider right now.</p>
                )}
                {!loading && !error && currentPlans.length > 0 && <div className="grid max-h-[28rem] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
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
                      <p className="mt-1 text-sm font-medium text-[var(--service-data)]">₦{plan.amount.toLocaleString()}</p>
                    </button>
                  ))}
                </div>}
              </div>

              {/* Summary */}
              {selectedPlan && (
                <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data Plan</span>
                    <span className="font-medium text-right">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-medium text-[var(--service-airtime)]">Free</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold">₦{selectedPlan.amount.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Submit */}
              {checkoutError && (
                <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  {checkoutError}
                </div>
              )}
              {checkoutState === "delivered" && (
                <div role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700">
                  Data delivered successfully.
                </div>
              )}
              <Button
                type="button"
                className="w-full bg-[var(--service-data)] hover:bg-[var(--service-data)]/90 text-white"
                disabled={!selectedPlan || !phoneNumber.trim() || checkoutState === "starting" || checkoutState === "confirming"}
                onClick={handleCheckout}
              >
                {checkoutState === "starting" || checkoutState === "confirming" ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{checkoutState === "starting" ? "Opening secure payment…" : "Confirming and delivering…"}</>
                ) : "Buy Data"}
              </Button>
              {pendingOperation && checkoutState === "idle" && (
                <Button type="button" variant="outline" className="w-full" onClick={checkPendingCheckout}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Check saved payment
                </Button>
              )}
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
              <p className="text-sm text-muted-foreground">No recent purchases yet. Successful live transactions will appear here after checkout is connected.</p>
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
