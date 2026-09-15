import { expect, test } from "@playwright/test"

test.describe("Transaction receipts", () => {
  test("opens a completed electricity receipt and exposes the delivery actions", async ({ page }) => {
    await page.goto("/dashboard/transactions")

    await page.getByRole("link", { name: /EKEDC Prepaid/ }).click()

    await expect(page).toHaveURL(/\/dashboard\/transactions\/TXN003$/)
    await expect(page.getByRole("heading", { name: "Electricity receipt" })).toBeVisible()
    await expect(page.getByText("Sample Customer", { exact: true })).toBeVisible()
    await expect(page.getByText("45678901234", { exact: true }).first()).toBeVisible()
    await expect(page.getByText("1234-5678-9012-3456-7890", { exact: true })).toBeVisible()
    await expect(page.getByRole("button", { name: "Copy token" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Download PDF" })).toBeVisible()
  })

  test("copies the token and downloads the branded receipt PDF", async ({ page }) => {
    await page.goto("/dashboard/transactions/TXN003")

    await page.getByRole("button", { name: "Copy token" }).click()
    await expect(page.getByRole("button", { name: "Token copied" })).toBeVisible()

    const downloadPromise = page.waitForEvent("download")
    await page.getByRole("button", { name: "Download PDF" }).click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toBe("choyis-receipt-CTR-260531-001236.pdf")
  })

  test("fits the receipt on a phone without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/dashboard/transactions/TXN003")

    await expect(page.getByTestId("receipt-document")).toBeVisible()
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )

    expect(hasHorizontalOverflow).toBe(false)
  })
})
