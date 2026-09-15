import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { TransactionReceipt } from "@/components/receipts/transaction-receipt"
import { getTransactionById } from "@/lib/transactions"

type TransactionReceiptPageProps = {
  params: Promise<{ id: string }>
}

export default async function TransactionReceiptPage({ params }: TransactionReceiptPageProps) {
  const { id } = await params
  const transaction = getTransactionById(id)

  if (!transaction?.receipt) notFound()

  return (
    <div className="min-w-0 space-y-5">
      <Link
        href="/dashboard/transactions"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to transactions
      </Link>
      <TransactionReceipt transaction={transaction} />
    </div>
  )
}
