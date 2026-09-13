import { expect, test, type Page } from "@playwright/test"

const liveFixtures: Record<string, Array<{ variation_code: string; name: string; variation_amount: string }>> = {
  "mtn-data": [
    { variation_code: "mtn-live-5gb", name: "MTN Live 5GB - 30 days", variation_amount: "1234.00" },
  ],
  "glo-data": [
    { variation_code: "glo-live-2gb", name: "Glo Live 2GB - 14 days", variation_amount: "987.00" },
  ],
  dstv: [
    { variation_code: "dstv-live-padi", name: "DStv Live Padi", variation_amount: "1850.00" },
  ],
  "smile-direct": [
    { variation_code: "smile-live-2gb", name: "Smile Live 2GB", variation_amount: "1020.00" },
  ],
}

async function mockVtpass(page: Page) {
  await page.route("**/functions/v1/vtpass-utilities**", async (route) => {
    const request = route.request()
    const url = new URL(request.url())

    if (request.method() === "GET" && url.searchParams.get("action") === "variations") {
      const serviceId = url.searchParams.get("serviceID") ?? ""
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ code: "000", content: { variations: liveFixtures[serviceId] ?? [] } }),
      })
      return
    }

    if (request.method() === "POST") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ code: "000", content: { Customer_Name: "Verified VTpass Customer" } }),
      })
      return
    }

    await route.abort()
  })
}

test.describe("Live utility catalogue", () => {
  test.beforeEach(async ({ page }) => mockVtpass(page))

  test("loads data plans for the selected VTpass service ID", async ({ page }) => {
    await page.goto("/dashboard/data")
    await expect(page.getByRole("button", { name: /MTN Live 5GB/ })).toBeVisible()
    await expect(page.getByText("₦1,234", { exact: true })).toBeVisible()

    await page.getByRole("button", { name: "M MTN", exact: true }).click()
    await page.getByRole("button", { name: "G Glo", exact: true }).click()
    await expect(page.getByRole("button", { name: /Glo Live 2GB/ })).toBeVisible()
  })

  test("loads real TV package fields and verifies through VTpass", async ({ page }) => {
    await page.goto("/dashboard/tv")
    await expect(page.getByRole("button", { name: /DStv Live Padi/ })).toBeVisible()
    await page.getByPlaceholder("Enter your smartcard or IUC number").fill("1234567890")
    await page.getByRole("button", { name: "Verify smartcard with VTpass" }).click()
    await expect(page.getByText("Verified customer: Verified VTpass Customer")).toBeVisible()
  })

  test("loads internet plans only for supported providers", async ({ page }) => {
    await page.goto("/dashboard/internet")
    await expect(page.getByRole("button", { name: /Smile Live 2GB/ })).toBeVisible()
    await page.getByRole("button", { name: "SM Smile", exact: true }).click()
    await expect(page.getByRole("button", { name: "SP Spectranet", exact: true })).toBeVisible()
    await expect(page.getByRole("button", { name: /Swift|ipNX/ })).toHaveCount(0)
  })

  test("uses the complete electricity provider catalogue and live verification", async ({ page }) => {
    await page.goto("/dashboard/electricity")
    await page.getByRole("button", { name: /Ikeja Electric/ }).click()
    const yolaProvider = page.getByRole("button", { name: /Yola Electric/ })
    await expect(yolaProvider).toBeVisible()
    await yolaProvider.click()

    await page.getByLabel("Meter Number").fill("1234567890")
    await page.getByRole("button", { name: "Verify with VTpass" }).click()
    await expect(page.getByText("Customer: Verified VTpass Customer")).toBeVisible()
  })
})
