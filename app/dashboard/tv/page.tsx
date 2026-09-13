"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, ChevronDown, Clock, Loader2, RefreshCw, Tv } from "lucide-react"
import { tvProviders } from "@/lib/utilities/catalog"
import { useUtilityVariations } from "@/lib/utilities/use-utility-variations"
import { verifyUtilityCustomer, type UtilityVariation } from "@/lib/utilities/vtpass"

export default function TVPage() {
  const [selectedProvider, setSelectedProvider] = React.useState(tvProviders[0])
  const [selectedPackage, setSelectedPackage] = React.useState<UtilityVariation | null>(null)
  const [showProviderDropdown, setShowProviderDropdown] = React.useState(false)
  const [smartcardNumber, setSmartcardNumber] = React.useState("")
  const [verifying, setVerifying] = React.useState(false)
  const [verifyError, setVerifyError] = React.useState("")
  const [verifiedCustomer, setVerifiedCustomer] = React.useState("")
  const verificationController = React.useRef<AbortController | null>(null)
  const { variations: packages, loading, error, retry } = useUtilityVariations(selectedProvider.serviceId)

  const resetVerification = () => {
    verificationController.current?.abort()
    verificationController.current = null
    setVerifying(false)
    setVerifyError("")
    setVerifiedCustomer("")
  }

  const verifySmartcard = async () => {
    resetVerification()
    const controller = new AbortController()
    verificationController.current = controller
    setVerifying(true)
    try {
      const customer = await verifyUtilityCustomer(selectedProvider.serviceId, smartcardNumber.trim(), controller.signal)
      if (verificationController.current !== controller) return
      setVerifiedCustomer(customer.name)
    } catch (reason) {
      if (controller.signal.aborted) return
      setVerifyError(reason instanceof Error ? reason.message : "Could not verify this smartcard.")
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
      <div>
        <h1 className="text-2xl font-semibold text-foreground">TV Subscriptions</h1>
        <p className="text-muted-foreground">Renew your TV subscription instantly</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Tv className="h-5 w-5 text-purple-500" />
                </div>
                Renew TV Subscription
              </CardTitle>
              <CardDescription>Select a provider and package to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Select Provider</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                    className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm hover:border-purple-300 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">
                        {selectedProvider.badge}
                      </span>
                      <span className="font-medium">{selectedProvider.name}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {showProviderDropdown && (
                    <div className="absolute z-10 mt-2 w-full rounded-lg border border-border bg-card shadow-lg">
                      {tvProviders.map((provider) => (
                        <button
                          key={provider.serviceId}
                          type="button"
                          onClick={() => {
                            setSelectedProvider(provider)
                            setShowProviderDropdown(false)
                            setSelectedPackage(null)
                            resetVerification()
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <span className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">
                            {provider.badge}
                          </span>
                          <span>{provider.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Smartcard Number */}
              <div>
                <label className="text-sm font-medium mb-2 block">Smartcard / IUC Number</label>
                <Input
                  type="text"
                  placeholder="Enter your smartcard or IUC number"
                  value={smartcardNumber}
                  onChange={(e) => {
                    setSmartcardNumber(e.target.value)
                    resetVerification()
                  }}
                  className="h-12"
                />
                <Button type="button" variant="outline" className="mt-2" disabled={!smartcardNumber.trim() || verifying} onClick={verifySmartcard}>
                  {verifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {verifying ? "Verifying…" : "Verify smartcard with VTpass"}
                </Button>
                {verifiedCustomer && (
                  <div role="status" className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> Verified customer: {verifiedCustomer}
                  </div>
                )}
                {verifyError && <p role="alert" className="mt-2 text-sm text-destructive">{verifyError}</p>}
              </div>

              {/* Package Selection */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-sm font-medium">Select Package</label>
                  <span className="text-xs font-medium text-emerald-600">Live VTpass prices</span>
                </div>
                {loading && <div role="status" className="flex items-center justify-center gap-2 rounded-lg border border-border p-8 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading live packages…</div>}
                {!loading && error && (
                  <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
                    <div className="flex items-start gap-2 text-destructive"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></div>
                    <Button type="button" variant="outline" size="sm" className="mt-3" onClick={retry}><RefreshCw className="mr-2 h-3.5 w-3.5" /> Retry</Button>
                  </div>
                )}
                {!loading && !error && packages.length === 0 && <p className="rounded-lg border border-border p-6 text-center text-sm text-muted-foreground">No packages are available for this provider right now.</p>}
                {!loading && !error && packages.length > 0 && <div className="grid max-h-[30rem] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackage(pkg)}
                      className={`flex flex-col items-start rounded-lg border p-4 transition-all text-left ${
                        selectedPackage?.id === pkg.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-border hover:border-purple-300"
                      }`}
                    >
                      <span className="text-sm font-medium">{pkg.name}</span>
                      <span className="text-lg font-semibold text-purple-600 mt-1">₦{pkg.amount.toLocaleString()}</span>
                    </button>
                  ))}
                </div>}
              </div>

              <Button
                type="button"
                className="w-full h-12 bg-purple-500 hover:bg-purple-600 text-white"
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
                Recent TV Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">No recent subscriptions yet. Successful live transactions will appear here after checkout is connected.</p></CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
