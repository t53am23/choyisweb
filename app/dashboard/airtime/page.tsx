"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Check, CheckCircle2, ChevronDown, Clock, Loader2, Smartphone } from "lucide-react"
import {
  confirmUtilityCheckout,
  startUtilityCheckout,
  UtilityCheckoutError,
  type UtilityCheckoutResult,
} from "@/lib/utilities/checkout"

const providers = [
  { id: "mtn", name: "MTN", color: "#FFCC00" },
  { id: "glo", name: "Glo", color: "#50B848" },
  { id: "airtel", name: "Airtel", color: "#E30613" },
  { id: "9mobile", name: "9mobile", color: "#006848" },
]

const quickAmounts = [100, 200, 500, 1000, 2000, 5000]

const PENDING_AIRTIME_KEY = "choyisweb:pending-airtime-transaction"
const POLL_INTERVAL_MS = 5_000
const MAX_POLL_ATTEMPTS = 60

type CheckoutStage = "idle" | "initializing" | "awaiting_payment" | "confirming" | "delivered"

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

function checkoutMessage(error: unknown) {
  if (error instanceof UtilityCheckoutError) return error.message
  if (error instanceof Error) return error.message
  return "Airtime checkout could not be completed."
}

export default function AirtimePage() {
  const [selectedProvider, setSelectedProvider] = React.useState(providers[0])
  const [showProviderDropdown, setShowProviderDropdown] = React.useState(false)
  const [amount, setAmount] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [stage, setStage] = React.useState<CheckoutStage>("idle")
  const [error, setError] = React.useState("")
  const [receipt, setReceipt] = React.useState<UtilityCheckoutResult | null>(null)
  const [pendingTransactionId, setPendingTransactionId] = React.useState<string | null>(null)
  const idempotencyKey = React.useRef<string | null>(null)

  React.useEffect(() => {
    setPendingTransactionId(sessionStorage.getItem(PENDING_AIRTIME_KEY))
  }, [])

  const rememberPendingTransaction = (transactionId: string) => {
    sessionStorage.setItem(PENDING_AIRTIME_KEY, transactionId)
    setPendingTransactionId(transactionId)
  }

  const completeTransaction = (result: UtilityCheckoutResult) => {
    sessionStorage.removeItem(PENDING_AIRTIME_KEY)
    setPendingTransactionId(null)
    setReceipt(result)
    setStage("delivered")
    idempotencyKey.current = null
  }

  const confirmUntilComplete = async (transactionId: string, paymentWindow?: Window | null) => {
    setStage("confirming")
    let lastError: unknown = null

    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
      if (attempt > 0) await wait(POLL_INTERVAL_MS)

      try {
        const result = await confirmUtilityCheckout(transactionId)
        if (result.status === "delivered") {
          completeTransaction(result)
          paymentWindow?.close()
          return
        }
        if (result.status === "failed") {
          throw new UtilityCheckoutError("Payment completed, but airtime delivery failed.", "DELIVERY_FAILED")
        }
      } catch (caught) {
        lastError = caught
        const retryable = caught instanceof UtilityCheckoutError && caught.retryable
        if (!retryable) throw caught
      }

      if (paymentWindow?.closed) break
    }

    setStage("awaiting_payment")
    throw new UtilityCheckoutError(
      lastError
        ? "Payment has not been confirmed yet. Use Check payment status to continue."
        : "Payment confirmation is taking longer than expected. Use Check payment status to continue.",
      "PAYMENT_PENDING",
      true,
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setReceipt(null)

    const paymentWindow = window.open(
      "",
      "choyis-paystack",
      "popup=yes,width=520,height=760,resizable=yes,scrollbars=yes",
    )

    if (!paymentWindow) {
      setError("Allow payment pop-ups for this site, then try again.")
      return
    }

    try {
      setStage("initializing")
      idempotencyKey.current ||= crypto.randomUUID()
      const checkout = await startUtilityCheckout({
        serviceType: "airtime",
        phone: phoneNumber,
        provider: selectedProvider.id as "mtn" | "glo" | "airtel" | "9mobile",
        amount: Number(amount),
        idempotencyKey: idempotencyKey.current,
      })

      rememberPendingTransaction(checkout.transactionId)
      setStage("awaiting_payment")
      paymentWindow.location.replace(checkout.authorizationUrl)
      await confirmUntilComplete(checkout.transactionId, paymentWindow)
    } catch (caught) {
      paymentWindow.close()
      setError(checkoutMessage(caught))
      setStage("idle")
    }
  }

  const handleResumeConfirmation = async () => {
    if (!pendingTransactionId) return
    setError("")
    try {
      await confirmUntilComplete(pendingTransactionId)
    } catch (caught) {
      setError(checkoutMessage(caught))
      setStage("idle")
    }
  }

  const isBusy = stage === "initializing" || stage === "confirming"

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
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
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
                  autoComplete="tel"
                  inputMode="tel"
                  required
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
                  min={50}
                  max={50000}
                  step={1}
                  required
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

              {error && (
                <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {receipt && (
                <div role="status" className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Airtime delivered successfully. Reference: {receipt.reference}</span>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-[var(--service-airtime)] hover:bg-[var(--service-airtime)]/90 text-white"
                disabled={!amount || !phoneNumber || isBusy}
              >
                {isBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {stage === "initializing"
                  ? "Starting secure payment…"
                  : stage === "confirming"
                    ? "Confirming payment…"
                    : "Buy Airtime"}
              </Button>
              {pendingTransactionId && !isBusy && (
                <Button type="button" variant="outline" className="w-full" onClick={handleResumeConfirmation}>
                  Check payment status
                </Button>
              )}
              </form>
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
              <div className="rounded-lg border border-dashed border-border p-4 text-center">
                <p className="text-sm font-medium text-foreground">No recent purchases yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your last successful top-ups will appear here when transaction history is connected.
                </p>
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
