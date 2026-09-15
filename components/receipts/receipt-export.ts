import type { TopupTransaction } from "@/lib/transactions"

const pdfMoney = (value: number) => `NGN ${value.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`

export async function downloadReceiptPdf(transaction: TopupTransaction) {
  const receipt = transaction.receipt
  if (!receipt) throw new Error("This transaction does not have a receipt.")

  const { jsPDF } = await import("jspdf")
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 42
  const contentWidth = pageWidth - margin * 2
  const right = pageWidth - margin
  let y = 44

  const line = (offset = 0) => {
    pdf.setDrawColor(226, 232, 240)
    pdf.line(margin, y + offset, right, y + offset)
  }

  const row = (label: string, value: string) => {
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(9)
    pdf.setTextColor(30, 41, 59)
    pdf.text(label, margin, y)
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(51, 65, 85)
    const wrapped = pdf.splitTextToSize(value, 300)
    pdf.text(wrapped, right, y, { align: "right" })
    y += Math.max(18, wrapped.length * 10 + 6)
  }

  pdf.setFillColor(16, 185, 129)
  pdf.circle(margin + 5, y + 3, 5, "F")
  pdf.setFillColor(52, 211, 153)
  pdf.circle(margin + 19, y + 3, 5, "F")
  pdf.circle(margin + 5, y + 17, 5, "F")
  pdf.setFillColor(110, 231, 183)
  pdf.circle(margin + 19, y + 17, 5, "F")

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(17)
  pdf.setTextColor(15, 23, 42)
  pdf.text("Choyis TopUp", margin + 34, y + 8)
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(8.5)
  pdf.setTextColor(100, 116, 139)
  pdf.text("PAYMENT RECEIPT", margin + 34, y + 22)

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(9)
  pdf.setTextColor(transaction.status === "completed" ? 4 : 185, transaction.status === "completed" ? 120 : 28, 87)
  pdf.text(transaction.status.toUpperCase(), right, y + 8, { align: "right" })
  pdf.setFont("helvetica", "normal")
  pdf.setTextColor(100, 116, 139)
  pdf.text(`Receipt ${receipt.receiptNumber}`, right, y + 22, { align: "right" })
  y += 45
  line()

  y += 34
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(9)
  pdf.setTextColor(100, 116, 139)
  pdf.text("SERVICE PROVIDER", pageWidth / 2, y, { align: "center" })
  y += 28
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(28)
  pdf.setTextColor(17, 44, 132)
  pdf.text(receipt.providerCode, pageWidth / 2, y, { align: "center" })
  y += 18
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(9)
  pdf.setTextColor(71, 85, 105)
  pdf.text(receipt.providerName, pageWidth / 2, y, { align: "center" })
  y += 28
  line()

  if (receipt.token) {
    y += 20
    pdf.setFillColor(236, 253, 245)
    pdf.roundedRect(margin, y, contentWidth, 62, 8, 8, "F")
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(9)
    pdf.setTextColor(4, 120, 87)
    pdf.text("ELECTRICITY TOKEN", margin + 16, y + 20)
    pdf.setFontSize(18)
    pdf.setTextColor(6, 78, 59)
    pdf.text(receipt.token, pageWidth / 2, y + 45, { align: "center" })
    y += 84
  } else {
    y += 22
  }

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(11)
  pdf.setTextColor(15, 23, 42)
  pdf.text("PURCHASE DETAILS", margin, y)
  y += 20
  row("Service", transaction.description)
  row("Recipient", transaction.recipient)
  if (receipt.customerName) row("Customer name", receipt.customerName)
  if (receipt.customerAddress) row("Service address", receipt.customerAddress)
  if (receipt.meterNumber) row("Meter number", receipt.meterNumber)
  if (receipt.meterType) row("Meter type", receipt.meterType)
  if (receipt.units) row("Units", receipt.units)

  y += 6
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(11)
  pdf.text("TRANSACTION DETAILS", margin, y)
  y += 20
  row("Date", new Date(transaction.date).toLocaleString("en-NG"))
  row("Order reference", transaction.reference)
  if (receipt.providerReference) row("Provider reference", receipt.providerReference)
  if (receipt.providerReceiptNumber) row("Provider receipt", receipt.providerReceiptNumber)
  if (receipt.paymentMethod) row("Payment", receipt.paymentMethod)
  row("Payment reference", receipt.paymentReference || transaction.reference)

  y += 8
  pdf.setFillColor(248, 250, 252)
  pdf.roundedRect(margin, y, contentWidth, 144, 8, 8, "F")
  y += 21
  row("Cost of utility", pdfMoney(receipt.subtotal ?? transaction.amount))
  if (receipt.vat !== undefined) row("VAT", pdfMoney(receipt.vat))
  if (receipt.debt !== undefined) row("Debt", pdfMoney(receipt.debt))
  if (receipt.remainingDebt !== undefined) row("Remaining debt", pdfMoney(receipt.remainingDebt))
  row("Service charge", pdfMoney(receipt.serviceCharge ?? 0))
  row("Discount", pdfMoney(receipt.discount ?? 0))
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(12)
  pdf.setTextColor(4, 120, 87)
  pdf.text("Total paid", margin + 14, y)
  pdf.text(pdfMoney(transaction.amount), right - 14, y, { align: "right" })

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(8)
  pdf.setTextColor(100, 116, 139)
  pdf.text(`Purchased via ${receipt.purchasedVia}.`, pageWidth / 2, 812, { align: "center" })
  pdf.save(`choyis-receipt-${receipt.receiptNumber}.pdf`)
}
