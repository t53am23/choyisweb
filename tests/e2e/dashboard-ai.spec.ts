import { expect, test } from "@playwright/test"

test.describe("AI-native dashboard preview", () => {
  test("routes AI requests into the same inline transaction form", async ({ page }) => {
    await page.goto("/dashboard")

    await expect(page.getByRole("button", { name: "Use voice to ask Choyis" })).toBeVisible()
    await page.getByLabel("Ask Choyis to prepare a top up").fill("Buy ₦101 MTN airtime for 08031234567")
    await page.getByRole("button", { name: "Prepare transaction" }).click()

    await expect(page.getByRole("tab", { name: "Airtime", exact: true })).toHaveAttribute("aria-selected", "true")
    await expect(page.getByLabel("Phone Number", { exact: true })).toHaveValue("08031234567")
    await expect(page.getByLabel("Or Enter Amount", { exact: true })).toHaveValue("101")
    await expect(page).toHaveURL(/\/dashboard$/)
  })

  test("reuses a due-soon draft in the inline electricity form", async ({ page }) => {
    await page.goto("/dashboard")
    await page.getByRole("button", { name: "Pay again" }).click()

    await expect(page.getByRole("tab", { name: "Electricity", exact: true })).toHaveAttribute("aria-selected", "true")
    await expect(page.getByLabel("Meter Number")).toHaveValue("04198812754")
    await expect(page.getByLabel("Amount (₦)")).toHaveValue("5000")
    await expect(page).toHaveURL(/\/dashboard$/)
  })

  test("shows responsive insights without horizontal page overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/dashboard/insights")

    await expect(page.getByRole("heading", { name: "Spending insights" })).toBeVisible()
    await expect(page.getByText("Preview data", { exact: true })).toBeVisible()
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(hasOverflow).toBe(false)
  })
})
