import { expect, test } from "@playwright/test";

const expectedPublicationTypes = ["Survey", "Position paper", "Preprint"];

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    )
    .toBe(true);
}

test("desktop navigation opens the publication archive", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  await page.getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Publications" })
    .click();

  await expect(page).toHaveURL(/\/publications\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Publications" })).toBeVisible();
});

test("the current news feed is not a useless keyboard stop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#news");

  const feed = page.locator(".news-feed");
  await expect(feed).not.toHaveAttribute("tabindex", "0");
  await expect(feed).not.toHaveAttribute("role", "region");

  await page.keyboard.press("Tab");
  while ((await page.evaluate(() => document.activeElement?.tagName)) !== "BODY") {
    await expect(feed).not.toBeFocused();
    await page.keyboard.press("Tab");
  }
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`has no horizontal overflow at ${viewport.name} size`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expectNoHorizontalOverflow(page);
    await page.goto("/publications/");
    await expectNoHorizontalOverflow(page);
  });
}

test("mobile menu expands and navigates", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const menu = page.locator('button[aria-controls="mobile-navigation"]');
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");

  const mobileNavigation = page.getByRole("navigation", { name: "Mobile" });
  await expect(mobileNavigation).toBeVisible();
  await mobileNavigation.getByRole("link", { name: "Publications" }).click();
  await expect(page).toHaveURL(/\/publications\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Publications" })).toBeVisible();
});

test("publications are newest first and expose their types", async ({ page }) => {
  await page.goto("/publications/");

  const rows = page.locator(".publication-row");
  await expect(rows).toHaveCount(3);
  await expect(rows.locator(".publication-kicker")).toHaveText([
    "2025 · Survey",
    "2025 · Position paper",
    "2024 · Preprint",
  ]);
  await expect(rows.locator(".publication-kicker")).toContainText(expectedPublicationTypes);
});

test("reduced motion disables intro and decorative motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/publications/");

  for (const selector of [".publications-intro", ".site-header__mark"]) {
    const durations = await page.locator(selector).evaluate((element) => {
      const styles = getComputedStyle(element);
      return [styles.animationDuration, styles.transitionDuration].map((duration) =>
        duration.endsWith("ms") ? Number.parseFloat(duration) : Number.parseFloat(duration) * 1000,
      );
    });
    expect(durations.every((duration) => duration <= 0.01)).toBe(true);
  }
});
