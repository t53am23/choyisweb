import { expect, test } from "@playwright/test"

test.describe("Airtime checkout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/airtime")
  })

  test("hydrates dashboard interactions", async ({ page }) => {
    await page.getByRole("button", { name: "M MTN", exact: true }).click()
    await expect(page.getByRole("button", { name: "G Glo", exact: true })).toBeVisible()
  })

  test("updates the order summary from the live form controls", async ({ page }) => {
    const buyButton = page.getByRole("button", { name: "Buy Airtime", exact: true })

    await expect(buyButton).toBeDisabled()
    await page.getByLabel("Phone Number", { exact: true }).fill("08000000000")
    await page.getByRole("button", { name: "₦100", exact: true }).click()

    await expect(page.getByLabel("Or Enter Amount", { exact: true })).toHaveValue("100")
    await expect(page.getByText("Free", { exact: true })).toBeVisible()
    await expect(buyButton).toBeEnabled()
  })

  test("blocks checkout when there is no authenticated Supabase session", async ({ page }) => {
    await page.getByLabel("Phone Number", { exact: true }).fill("08000000000")
    await page.getByRole("button", { name: "₦100", exact: true }).click()

    const popupPromise = page.waitForEvent("popup")
    await page.getByRole("button", { name: "Buy Airtime", exact: true }).click()
    const popup = await popupPromise

    await expect(
      page.getByRole("alert").filter({ hasText: "A secure login is required before payment" }),
    ).toBeVisible()
    await expect.poll(() => popup.isClosed()).toBe(true)
  })
})
