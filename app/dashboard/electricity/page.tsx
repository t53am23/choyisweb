"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Check, ChevronDown, Clock, Loader2, Zap } from "lucide-react"
import { electricityProviders } from "@/lib/utilities/catalog"
import { verifyUtilityCustomer } from "@/lib/utilities/vtpass"

type MeterType = "prepaid" | "postpaid"

export default function ElectricityPage() {
  const [selectedDisco, setSelectedDisco] = React.useState(electricityProviders[0])
  const [showDiscoDropdown, setShowDiscoDropdown] = React.useState(false)
  const [meterNumber, setMeterNumber] = React.useState("")
  const [meterType, setMeterType] = React.useState<MeterType>("prepaid")
  const [amount, setAmount] = React.useState("")
  const [meterVerified, setMeterVerified] = React.useState(false)
  const [customerName, setCustomerName] = React.useState("")
  const [customerAddress, setCustomerAddress] = React.useState("")
  const [verifiedMeterNumber, setVerifiedMeterNumber] = React.useState("")
  const [verifiedMeterType, setVerifiedMeterType] = React.useState("")
  const [minimumPurchase, setMinimumPurchase] = React.useState<number | null>(null)
  const [verifying, setVerifying] = React.useState(false)
  const [verifyError, setVerifyError] = React.useState("")
  const verificationController = React.useRef<AbortController | null>(null)

  const resetVerification = () => {
    verificationController.current?.abort()
    verificationController.current = null
    setVerifying(false)
    setMeterVerified(false)
    setCustomerName("")
    setCustomerAddress("")
    setVerifiedMeterNumber("")
    setVerifiedMeterType("")
    setMinimumPurchase(null)
    setVerifyError("")
  }

  const verifyMeter = async () => {
    resetVerification()
    const controller = new AbortController()
    verificationController.current = controller
    setVerifying(true)
    try {
      const customer = await verifyUtilityCustomer(selectedDisco.serviceId, meterNumber.trim(), {
        type: meterType,
        signal: controller.signal,
      })
      if (verificationController.current !== controller) return
      setCustomerName(customer.name)
      setCustomerAddress(customer.address)
      setVerifiedMeterNumber(customer.meterNumber)
      setVerifiedMeterType(customer.meterType)
      setMinimumPurchase(customer.minimumPurchase)
      setMeterVerified(true)
    } catch (reason) {
      if (controller.signal.aborted) return
      setVerifyError(reason instanceof Error ? reason.message : "Could not verify this meter.")
    } finally {
      if (verificationController.current === controller) {
        verificationController.current = null
        setVerifying(false)
      }
    }
  }

  React.useEffect(() => () => {
    verificationController.current?.abort()
    verificationController.current = null
  }, [])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-6 w-6 text-[var(--service-electricity)]" />
          Pay Electricity
        </h1>
        <p className="text-sm text-muted-foreground">Purchase electricity tokens for prepaid meters</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Electricity Token</CardTitle>
              <CardDescription>Enter your meter details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Disco Selection */}
              <div className="space-y-2">
                <Label>Distribution Company (DisCo)</Label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDiscoDropdown(!showDiscoDropdown)}
                    className="w-full flex items-center justify-between rounded-lg border border-input bg-background px-4 py-3 hover:border-primary/50 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-full bg-[var(--service-electricity)]/20 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-[var(--service-electricity)]" />
                      </span>
                      <div className="text-left">
                        <span className="font-medium block">{selectedDisco.name}</span>
                        <span className="text-xs text-muted-foreground">{selectedDisco.region}</span>
                      </div>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {showDiscoDropdown && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg max-h-64 overflow-y-auto">
                      {electricityProviders.map((disco) => (
                        <button
                          key={disco.serviceId}
                          type="button"
                          onClick={() => {
                            setSelectedDisco(disco)
                            setShowDiscoDropdown(false)
                            resetVerification()
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <span className="h-8 w-8 rounded-full bg-[var(--service-electricity)]/20 flex items-center justify-center">
                            <Zap className="h-4 w-4 text-[var(--service-electricity)]" />
                          </span>
                          <div className="text-left">
                            <span className="font-medium block">{disco.name}</span>
                            <span className="text-xs text-muted-foreground">{disco.region}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Meter Type */}
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Meter Type</legend>
                <div className="grid grid-cols-2 gap-2">
                  {(["prepaid", "postpaid"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={meterType === type}
                      onClick={() => {
                        setMeterType(type)
                        resetVerification()
                      }}
                      className={`rounded-lg border px-4 py-3 text-sm font-medium capitalize transition-colors ${
                        meterType === type
                          ? "border-[var(--service-electricity)] bg-[var(--service-electricity)]/10 text-[var(--service-electricity)]"
                          : "border-border bg-background hover:border-[var(--service-electricity)]/40"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Meter Number */}
              <div className="space-y-2">
                <Label htmlFor="meter">Meter Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="meter"
                    type="text"
                    placeholder="Enter meter number"
                    value={meterNumber}
                    onChange={(e) => {
                      setMeterNumber(e.target.value)
                      resetVerification()
                    }}
                    className="bg-background flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={verifyMeter}
                    disabled={!meterNumber.trim() || verifying}
                  >
                    {verifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {verifying ? "Verifying…" : "Verify with VTpass"}
                  </Button>
                </div>
                {verifyError && (
                  <p role="alert" className="flex items-start gap-2 text-sm text-destructive"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{verifyError}</p>
                )}
              </div>

              {/* Verification Result */}
              {meterVerified && (
                <div className="rounded-lg bg-[var(--service-airtime-bg)] border border-[var(--service-airtime)]/20 p-3 flex items-center gap-3">
                  <Check className="h-5 w-5 text-[var(--service-airtime)]" />
                  <div>
                    <p className="text-sm font-medium">Meter Verified</p>
                    {customerName && <p className="text-xs text-muted-foreground">Customer: {customerName}</p>}
                    {customerAddress && <p className="text-xs text-muted-foreground">{customerAddress}</p>}
                    {verifiedMeterNumber && <p className="text-xs text-muted-foreground">Meter: {verifiedMeterNumber}</p>}
                    {verifiedMeterType && <p className="text-xs text-muted-foreground">Type: {verifiedMeterType}</p>}
                    {minimumPurchase !== null && <p className="text-xs text-muted-foreground">Minimum purchase: ₦{minimumPurchase.toLocaleString()}</p>}
                  </div>
                </div>
              )}

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={minimumPurchase === null ? "Enter amount" : `Minimum ₦${minimumPurchase.toLocaleString()}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-background"
                  min={minimumPurchase ?? undefined}
                />
              </div>

              {/* Quick Amounts */}
              <div className="grid grid-cols-3 gap-2">
                {[1000, 2000, 5000, 10000, 20000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className={`rounded-lg border p-2 text-sm font-medium transition-all ${
                      amount === amt.toString()
                        ? "border-[var(--service-electricity)] bg-[var(--service-electricity)]/5 text-[var(--service-electricity)]"
                        : "border-border bg-background hover:border-[var(--service-electricity)]/30"
                    }`}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Summary */}
              {amount && meterVerified && (
                <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">₦{Number(amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Provider charge</span>
                    <span className="font-medium">Confirmed at checkout</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-medium">Electricity value</span>
                    <span className="font-semibold">₦{Number(amount).toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                type="button"
                className="w-full bg-[var(--service-electricity)] hover:bg-[var(--service-electricity)]/90 text-white"
                disabled
              >
                Payment connection follows the verification batch
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Recent Meters */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Saved Meters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No saved meters yet. Verified live transactions will appear here after checkout is connected.</p>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-[var(--service-electricity-bg)] border-[var(--service-electricity)]/20">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[var(--service-electricity)]" />
                  <span className="text-sm">Instant token delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[var(--service-electricity)]" />
                  <span className="text-sm">All DisCos supported</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-[var(--service-electricity)]" />
                  <span className="text-sm">Minimum confirmed after verification</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
