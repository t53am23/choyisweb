function requireText(value, name) {
  const text = String(value ?? "").trim()
  if (!text) throw new Error(`${name} is required.`)
  return text
}

function requireEnvironment(value) {
  const environment = requireText(value, "Paystack environment").toLowerCase()
  if (!new Set(["sandbox", "live"]).has(environment)) {
    throw new Error("Paystack environment must be sandbox or live.")
  }
  return environment
}

async function responseData(response, message) {
  const body = await response.json().catch(() => null)
  if (!response.ok || !body?.status || !body.data) throw new Error(message)
  return body.data
}

export function createPaystackTransferAdapter({ environment, secretKey, fetchImpl = fetch }) {
  const normalizedEnvironment = requireEnvironment(environment)
  const privateSecretKey = requireText(secretKey, "Paystack secret key")
  if (normalizedEnvironment === "sandbox" && !privateSecretKey.startsWith("sk_test_")) {
    throw new Error("Paystack Sandbox requires a test secret key.")
  }
  if (normalizedEnvironment === "live" && !privateSecretKey.startsWith("sk_live_")) {
    throw new Error("Paystack Live requires a live secret key.")
  }

  const headers = { authorization: `Bearer ${privateSecretKey}` }

  return {
    name: "paystack",
    environment: normalizedEnvironment,

    async listBanks() {
      const response = await fetchImpl(
        "https://api.paystack.co/bank?country=nigeria&currency=NGN&perPage=100",
        { headers },
      )
      const banks = await responseData(response, "The bank list could not be loaded.")
      return banks
        .filter((bank) => bank?.active && bank.country === "Nigeria" && bank.currency === "NGN")
        .map((bank) => ({
          code: requireText(bank.code, "Bank code"),
          name: requireText(bank.name, "Bank name"),
          type: String(bank.type ?? "nuban"),
        }))
        .sort((left, right) => left.name.localeCompare(right.name))
    },

    async resolveAccount({ accountNumber, bankCode }) {
      const normalizedAccountNumber = String(accountNumber ?? "").replace(/\s/g, "")
      if (!/^\d{10}$/.test(normalizedAccountNumber)) {
        throw new Error("Enter a valid 10-digit Nigerian account number.")
      }
      const normalizedBankCode = requireText(bankCode, "Bank code")
      if (!/^[A-Za-z0-9-]{2,20}$/.test(normalizedBankCode)) {
        throw new Error("Select a valid bank.")
      }
      const query = new URLSearchParams({
        account_number: normalizedAccountNumber,
        bank_code: normalizedBankCode,
      })
      const response = await fetchImpl(`https://api.paystack.co/bank/resolve?${query}`, { headers })
      const account = await responseData(response, "The account could not be verified.")
      return {
        accountName: requireText(account.account_name, "Account name"),
        accountNumber: requireText(account.account_number, "Account number"),
        bankCode: normalizedBankCode,
      }
    },
  }
}
