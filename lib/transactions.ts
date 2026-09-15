export type TransactionStatus = "completed" | "pending" | "failed"

export type ReceiptDetails = {
  receiptNumber: string
  providerName: string
  providerCode: string
  purchasedVia: string
  paymentMethod?: string
  paymentReference?: string
  providerReference?: string
  providerReceiptNumber?: string
  customerName?: string
  customerAddress?: string
  meterNumber?: string
  meterType?: "Prepaid" | "Postpaid"
  token?: string
  units?: string
  subtotal?: number
  vat?: number
  debt?: number
  remainingDebt?: number
  serviceCharge?: number
  discount?: number
}

export type TopupTransaction = {
  id: string
  type: "airtime" | "data" | "electricity" | "internet" | "tv" | "ai"
  description: string
  recipient: string
  amount: number
  status: TransactionStatus
  date: string
  reference: string
  receipt?: ReceiptDetails
}

export const transactions: TopupTransaction[] = [
  {
    id: "TXN001",
    type: "airtime",
    description: "MTN Airtime Top-up",
    recipient: "080 1234 5678",
    amount: 1000,
    status: "completed",
    date: "2026-06-01T14:30:00",
    reference: "CHY-AIR-001234",
    receipt: {
      receiptNumber: "CTR-260601-001234",
      providerName: "MTN Nigeria",
      providerCode: "MTN",
      purchasedVia: "Choyis TopUp",
      paymentMethod: "Card via Paystack",
      paymentReference: "PAY-CHY-AIR-001234",
      providerReference: "UTILITY-AIR-001234",
      subtotal: 1000,
      serviceCharge: 0,
      discount: 0,
    },
  },
  {
    id: "TXN002",
    type: "data",
    description: "MTN 5GB Data Bundle",
    recipient: "080 1234 5678",
    amount: 2500,
    status: "completed",
    date: "2026-06-01T12:15:00",
    reference: "CHY-DAT-001235",
    receipt: {
      receiptNumber: "CTR-260601-001235",
      providerName: "MTN Nigeria",
      providerCode: "MTN",
      purchasedVia: "Choyis TopUp",
      paymentMethod: "Card via Paystack",
      paymentReference: "PAY-CHY-DAT-001235",
      providerReference: "UTILITY-DAT-001235",
      subtotal: 2500,
      serviceCharge: 0,
      discount: 0,
    },
  },
  {
    id: "TXN003",
    type: "electricity",
    description: "EKEDC Prepaid",
    recipient: "45678901234",
    amount: 10000,
    status: "completed",
    date: "2026-05-31T09:45:00",
    reference: "CHY-ELC-001236",
    receipt: {
      receiptNumber: "CTR-260531-001236",
      providerName: "Eko Electricity Distribution Company",
      providerCode: "EKEDC",
      purchasedVia: "Choyis TopUp",
      paymentMethod: "Card via Paystack",
      paymentReference: "PAY-CHY-ELC-001236",
      providerReference: "UTILITY-ELC-001236",
      providerReceiptNumber: "PROV-260531-001236",
      customerName: "Sample Customer",
      customerAddress: "Sample service address",
      meterNumber: "45678901234",
      meterType: "Prepaid",
      token: "1234-5678-9012-3456-7890",
      units: "44.4 kWh",
      subtotal: 9900,
      vat: 0,
      debt: 0,
      remainingDebt: 0,
      serviceCharge: 100,
      discount: 0,
    },
  },
  {
    id: "TXN004",
    type: "tv",
    description: "DStv Compact",
    recipient: "1234567890",
    amount: 15700,
    status: "completed",
    date: "2026-05-30T16:20:00",
    reference: "CHY-TV-001237",
    receipt: {
      receiptNumber: "CTR-260530-001237",
      providerName: "MultiChoice Nigeria",
      providerCode: "DStv",
      purchasedVia: "Choyis TopUp",
      paymentMethod: "Card via Paystack",
      paymentReference: "PAY-CHY-TV-001237",
      providerReference: "UTILITY-TV-001237",
      subtotal: 15700,
      serviceCharge: 0,
      discount: 0,
    },
  },
  {
    id: "TXN005",
    type: "internet",
    description: "Spectranet 25GB",
    recipient: "SPT-12345",
    amount: 10000,
    status: "pending",
    date: "2026-05-30T11:00:00",
    reference: "CHY-INT-001238",
    receipt: {
      receiptNumber: "CTR-260530-001238",
      providerName: "Spectranet",
      providerCode: "Spectranet",
      purchasedVia: "Choyis TopUp",
      paymentMethod: "Card via Paystack",
      paymentReference: "PAY-CHY-INT-001238",
      subtotal: 10000,
      serviceCharge: 0,
      discount: 0,
    },
  },
  {
    id: "TXN006",
    type: "ai",
    description: "AI Credits Top-up",
    recipient: "user@email.com",
    amount: 5000,
    status: "completed",
    date: "2026-05-29T08:30:00",
    reference: "CHY-AI-001239",
    receipt: {
      receiptNumber: "CTR-260529-001239",
      providerName: "Choyis AI",
      providerCode: "Choyis AI",
      purchasedVia: "Choyis TopUp",
      paymentMethod: "Card via Paystack",
      paymentReference: "PAY-CHY-AI-001239",
      providerReference: "AI-CREDIT-001239",
      subtotal: 5000,
      serviceCharge: 0,
      discount: 0,
    },
  },
  {
    id: "TXN007",
    type: "airtime",
    description: "Glo Airtime Top-up",
    recipient: "090 8765 4321",
    amount: 500,
    status: "failed",
    date: "2026-05-28T19:15:00",
    reference: "CHY-AIR-001240",
    receipt: {
      receiptNumber: "CTR-260528-001240",
      providerName: "Globacom Nigeria",
      providerCode: "Glo",
      purchasedVia: "Choyis TopUp",
      paymentMethod: "Card via Paystack",
      paymentReference: "PAY-CHY-AIR-001240",
      subtotal: 500,
      serviceCharge: 0,
      discount: 0,
    },
  },
]

export function getTransactionById(id: string) {
  return transactions.find((transaction) => transaction.id === id)
}
