"use client"

import * as React from "react"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Info,
  Loader2,
  RefreshCw,
  SendHorizontal,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  loadTransferBanks,
  resolveTransferAccount,
  type ResolvedTransferAccount,
  type TransferBank,
} from "@/lib/transfers/paystack"

type TransferWorkspaceProps = { embedded?: boolean }

function transferError(error: unknown) {
  return error instanceof Error ? error.message : "The request could not be completed. Please try again."
}

export function TransferWorkspace({ embedded = false }: TransferWorkspaceProps) {
  const [banks, setBanks] = React.useState<TransferBank[]>([])
  const [banksLoading, setBanksLoading] = React.useState(true)
  const [bankError, setBankError] = React.useState("")
  const [bankCode, setBankCode] = React.useState("")
  const [accountNumber, setAccountNumber] = React.useState("")
  const [account, setAccount] = React.useState<ResolvedTransferAccount | null>(null)
  const [resolving, setResolving] = React.useState(false)
  const [resolveError, setResolveError] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [narration, setNarration] = React.useState("")
  const [reviewing, setReviewing] = React.useState(false)

  const fetchBanks = React.useCallback(async () => {
    setBanksLoading(true)
    setBankError("")
    try {
      setBanks(await loadTransferBanks())
    } catch (error) {
      setBankError(transferError(error))
    } finally {
      setBanksLoading(false)
    }
  }, [])

  React.useEffect(() => {
    let active = true
    loadTransferBanks()
      .then((result) => {
        if (active) setBanks(result)
      })
      .catch((error) => {
        if (active) setBankError(transferError(error))
      })
      .finally(() => {
        if (active) setBanksLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  function updateBank(value: string) {
    setBankCode(value)
    setAccount(null)
    setResolveError("")
    setReviewing(false)
  }

  function updateAccountNumber(value: string) {
    setAccountNumber(value.replace(/\D/g, "").slice(0, 10))
    setAccount(null)
    setResolveError("")
    setReviewing(false)
  }

  async function verifyRecipient() {
    setResolveError("")
    setAccount(null)
    setReviewing(false)
    if (!bankCode) {
      setResolveError("Select the recipient’s bank.")
      return
    }
    if (!/^\d{10}$/.test(accountNumber)) {
      setResolveError("Enter the recipient’s 10-digit account number.")
      return
    }
    try {
      setResolving(true)
      setAccount(await resolveTransferAccount(accountNumber, bankCode))
    } catch (error) {
      setResolveError(transferError(error))
    } finally {
      setResolving(false)
    }
  }

  const selectedBank = banks.find((bank) => bank.code === bankCode)
  const normalizedAmount = Number(amount)
  const amountIsValid = Number.isInteger(normalizedAmount) && normalizedAmount > 0
  const canReview = Boolean(account && amountIsValid)

  return (
    <div className="space-y-6">
      {!embedded && (
        <header>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <SendHorizontal className="h-6 w-6 text-primary" />
            Transfer money
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Verify the recipient before you review the transfer.</p>
        </header>
      )}

      <div className={embedded ? "grid gap-5" : "grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]"}>
        <Card className="overflow-hidden">
          <div className="h-1 bg-[linear-gradient(90deg,var(--primary),var(--service-ai))]" />
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg">{reviewing ? "Review transfer" : "Recipient details"}</CardTitle>
                <CardDescription className="mt-1">
                  {reviewing ? "Check every detail before money can move." : "Banks and account names are verified securely."}
                </CardDescription>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {reviewing ? <ShieldCheck className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {!reviewing ? (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="transfer-bank">Recipient bank</Label>
                    <div className="relative">
                      <select
                        id="transfer-bank"
                        value={bankCode}
                        onChange={(event) => updateBank(event.target.value)}
                        disabled={banksLoading || Boolean(bankError)}
                        className="h-11 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-10 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="">{banksLoading ? "Loading banks…" : "Choose a bank"}</option>
                        {banks.map((bank) => <option key={`${bank.code}-${bank.type}`} value={bank.code}>{bank.name}</option>)}
                      </select>
                      {banksLoading && <Loader2 className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 animate-spin text-muted-foreground" />}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transfer-account">Account number</Label>
                    <Input
                      id="transfer-account"
                      value={accountNumber}
                      onChange={(event) => updateAccountNumber(event.target.value)}
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="0123456789"
                      maxLength={10}
                      className="h-11 bg-background tabular-nums"
                    />
                  </div>
                </div>

                {bankError && (
                  <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
                    <div className="flex items-start gap-2 text-destructive"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{bankError}</span></div>
                    <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => void fetchBanks()}><RefreshCw className="h-3.5 w-3.5" />Retry</Button>
                  </div>
                )}

                {resolveError && (
                  <div role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{resolveError}</span>
                  </div>
                )}

                {account && (
                  <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Account verified</p>
                      <p className="mt-1 font-semibold text-foreground">{account.accountName}</p>
                      <p className="text-sm text-muted-foreground">{selectedBank?.name} · {account.accountNumber}</p>
                    </div>
                  </div>
                )}

                {!account && (
                  <Button type="button" variant="outline" className="w-full" disabled={resolving || banksLoading} onClick={() => void verifyRecipient()}>
                    {resolving ? <><Loader2 className="h-4 w-4 animate-spin" />Verifying account…</> : "Verify account"}
                  </Button>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="transfer-amount">Amount</Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-2.5 text-sm font-medium text-muted-foreground">₦</span>
                      <Input id="transfer-amount" type="number" inputMode="numeric" min={1} step={1} value={amount} onChange={(event) => { setAmount(event.target.value); setReviewing(false) }} placeholder="0" className="h-11 pl-8 tabular-nums" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transfer-narration">Narration <span className="font-normal text-muted-foreground">(optional)</span></Label>
                    <Textarea id="transfer-narration" value={narration} onChange={(event) => { setNarration(event.target.value.slice(0, 80)); setReviewing(false) }} placeholder="What is this for?" className="min-h-11 resize-none py-2.5" rows={1} />
                  </div>
                </div>

                <Button type="button" className="h-11 w-full" disabled={!canReview} onClick={() => setReviewing(true)}>
                  Continue to review <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-xl border bg-secondary/35 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                    <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">You are sending</p><p className="mt-1 text-3xl font-semibold tracking-tight">₦{normalizedAmount.toLocaleString()}</p></div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><SendHorizontal className="h-5 w-5" /></span>
                  </div>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Recipient</dt><dd className="text-right font-medium">{account?.accountName}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Bank</dt><dd className="text-right font-medium">{selectedBank?.name}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Account</dt><dd className="text-right font-medium tabular-nums">{account?.accountNumber}</dd></div>
                    {narration && <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Narration</dt><dd className="max-w-[65%] text-right font-medium">{narration}</dd></div>}
                  </dl>
                </div>
                <div className="flex items-start gap-2 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-sm text-foreground">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p>Recipient verification is connected. Sending stays locked until the transfer funding and authorization layer is approved.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
                  <Button type="button" variant="outline" onClick={() => setReviewing(false)}><ArrowLeft className="h-4 w-4" />Edit details</Button>
                  <Button type="button" disabled>Transfer sending not activated</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {!embedded && (
          <aside className="space-y-4">
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 text-primary" /><div><h2 className="font-semibold">Protected recipient check</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">The account name is returned by the bank-verification provider. Choyis does not guess or store a hardcoded bank list.</p></div></div>
              </CardContent>
            </Card>
            <Card className="border-primary/15 bg-primary/5">
              <CardContent className="pt-5"><p className="text-sm font-medium">Before you transfer</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Confirm the account name, bank and amount. A completed bank transfer may not be reversible.</p></CardContent>
            </Card>
          </aside>
        )}
      </div>
    </div>
  )
}
