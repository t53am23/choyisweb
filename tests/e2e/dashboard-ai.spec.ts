import { expect, test } from "@playwright/test"

test.describe("AI-native dashboard preview", () => {
  test("prepares a request without starting payment", async ({ page }) => {
    await page.goto("/dashboard")

    await expect(page.getByRole("heading", { name: "What would you like to top up?" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Use voice to ask Choyis" })).toBeVisible()
    await page.getByLabel("Ask Choyis to prepare a top up").fill("Buy my usual MTN data")
    await page.getByRole("button", { name: "Prepare top up" }).click()

    await expect(page.getByText("Request captured as a preview. No payment has started.")).toBeVisible()
    await expect(page.getByText("Estimated", { exact: true }).first()).toBeVisible()
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
