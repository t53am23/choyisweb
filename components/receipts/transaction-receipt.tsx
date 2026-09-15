"use client"

import * as React from "react"
import { Check, Copy, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TopupTransaction } from "@/lib/transactions"
import { downloadReceiptPdf } from "./receipt-export"

type TransactionReceiptProps = {
  transaction: TopupTransaction
}

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
})

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5" aria-label="Choyis TopUp">
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="4" className="fill-primary" />
        <circle cx="24" cy="8" r="4" className="fill-primary/60" />
        <circle cx="8" cy="24" r="4" className="fill-primary/60" />
        <circle cx="24" cy="24" r="4" className="fill-primary/40" />
      </svg>
      <div>
        <p className="text-base font-semibold leading-none text-slate-950">Choyis TopUp</p>
        <p className="mt-1 text-xs text-slate-500">Payment receipt</p>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-slate-100 py-2.5 last:border-0 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
      <dt className="text-sm font-semibold text-slate-800">{label}</dt>
      <dd className="min-w-0 break-words text-sm text-slate-700 sm:text-right">{value}</dd>
    </div>
  )
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const input = document.createElement("textarea")
  input.value = value
  input.style.position = "fixed"
  input.style.opacity = "0"
  document.body.appendChild(input)
  input.select()
  document.execCommand("copy")
  input.remove()
}

export function TransactionReceipt({ transaction }: TransactionReceiptProps) {
  const receipt = transaction.receipt
  const [copyState, setCopyState] = React.useState<"idle" | "copied">("idle")
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [downloadError, setDownloadError] = React.useState("")

  if (!receipt) return null

  const serviceLabel = transaction.type === "ai"
    ? "AI credits"
    : transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)
  const statusLabel = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)
  const statusClass = transaction.status === "completed"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : transaction.status === "pending"
      ? "bg-amber-50 text-amber-800 ring-amber-200"
      : "bg-red-50 text-red-700 ring-red-200"

  const dateLabel = new Date(transaction.date).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const handleCopy = async () => {
    if (!receipt.token) return
    await copyToClipboard(receipt.token)
    setCopyState("copied")
    window.setTimeout(() => setCopyState("idle"), 1800)
  }

  const handleDownload = async () => {
    if (isDownloading) return
    setIsDownloading(true)
    setDownloadError("")
    try {
      await downloadReceiptPdf(transaction)
    } catch {
      setDownloadError("The PDF could not be created. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[800px]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{serviceLabel} receipt</h1>
          <p className="mt-1 text-sm text-muted-foreground">Keep this transaction record for your reference.</p>
        </div>
        <Button type="button" onClick={handleDownload} disabled={isDownloading} className="w-full gap-2 sm:w-auto">
          {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {isDownloading ? "Preparing PDF" : "Download PDF"}
        </Button>
      </div>

      {downloadError ? <p role="alert" className="mb-4 text-sm font-medium text-red-600">{downloadError}</p> : null}

      <div
        data-testid="receipt-document"
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.35)]"
      >
        <header className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <BrandMark />
          <div className="sm:text-right">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass}`}>
              {transaction.status === "completed" ? <Check className="h-3.5 w-3.5" /> : null}
              {statusLabel}
            </span>
            <p className="mt-2 text-xs text-slate-500">Receipt {receipt.receiptNumber}</p>
          </div>
        </header>

        <section className="border-b border-slate-200 bg-slate-50 px-5 py-6 text-center sm:px-8">
          <p className="text-sm font-medium text-slate-500">Service provider</p>
          <p className="mt-1 text-3xl font-bold tracking-[-0.03em] text-[#112c84] sm:text-4xl">{receipt.providerCode}</p>
          <p className="mt-1 text-sm text-slate-600">{receipt.providerName}</p>
        </section>

        {receipt.token ? (
          <section className="border-b border-slate-200 px-5 py-6 sm:px-8">
            <div className="rounded-xl bg-emerald-50 px-4 py-5 ring-1 ring-inset ring-emerald-200 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-emerald-800">Electricity token</p>
                  <p className="mt-2 break-words text-lg font-bold tracking-[0.02em] text-emerald-950 sm:text-2xl sm:tracking-[0.04em]">
                    {receipt.token}
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={handleCopy} className="w-full shrink-0 gap-2 border-emerald-300 bg-white sm:w-auto">
                  {copyState === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copyState === "copied" ? "Token copied" : "Copy token"}
                </Button>
              </div>
            </div>
          </section>
        ) : null}

        <div className="grid gap-7 px-5 py-6 sm:px-8 md:grid-cols-2">
          <section>
            <h2 className="text-base font-semibold text-slate-950">Purchase details</h2>
            <dl className="mt-2">
              <DetailRow label="Service" value={transaction.description} />
              <DetailRow label="Recipient" value={transaction.recipient} />
              {receipt.customerName ? <DetailRow label="Customer name" value={receipt.customerName} /> : null}
              {receipt.customerAddress ? <DetailRow label="Service address" value={receipt.customerAddress} /> : null}
              {receipt.meterNumber ? <DetailRow label="Meter number" value={receipt.meterNumber} /> : null}
              {receipt.meterType ? <DetailRow label="Meter type" value={receipt.meterType} /> : null}
              {receipt.units ? <DetailRow label="Units" value={receipt.units} /> : null}
            </dl>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-950">Transaction details</h2>
            <dl className="mt-2">
              <DetailRow label="Date" value={dateLabel} />
              <DetailRow label="Order reference" value={transaction.reference} />
              <DetailRow label="Provider reference" value={receipt.providerReference || "Unavailable"} />
              {receipt.providerReceiptNumber ? <DetailRow label="Provider receipt" value={receipt.providerReceiptNumber} /> : null}
              <DetailRow label="Payment" value={receipt.paymentMethod || "Unavailable"} />
              <DetailRow label="Payment reference" value={receipt.paymentReference || transaction.reference} />
            </dl>
          </section>
        </div>

        <section className="border-t border-slate-200 bg-slate-50 px-5 py-5 sm:px-8">
          <dl className="ml-auto max-w-sm">
            <DetailRow label="Cost of utility" value={money.format(receipt.subtotal ?? transaction.amount)} />
            {receipt.vat !== undefined ? <DetailRow label="VAT" value={money.format(receipt.vat)} /> : null}
            {receipt.debt !== undefined ? <DetailRow label="Debt" value={money.format(receipt.debt)} /> : null}
            {receipt.remainingDebt !== undefined ? <DetailRow label="Remaining debt" value={money.format(receipt.remainingDebt)} /> : null}
            <DetailRow label="Service charge" value={money.format(receipt.serviceCharge ?? 0)} />
            <DetailRow label="Discount" value={money.format(receipt.discount ?? 0)} />
            <div className="flex items-center justify-between gap-4 pt-4">
              <dt className="font-semibold text-slate-950">Total paid</dt>
              <dd className="text-xl font-bold text-emerald-700">{money.format(transaction.amount)}</dd>
            </div>
          </dl>
        </section>

        <footer className="border-t border-slate-200 px-5 py-4 text-center text-xs leading-5 text-slate-500 sm:px-8">
          Purchased via {receipt.purchasedVia}.
        </footer>
      </div>
    </div>
  )
}
