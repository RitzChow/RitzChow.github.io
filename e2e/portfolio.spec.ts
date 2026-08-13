import { expect, test } from "@playwright/test";

const expectedPublicationTypes = ["Preprint", "Preprint", "Survey", "Position paper"];

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
  { name: "tablet", width: 768, height: 1024 },
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

test("a cross-page home anchor lands on its target section", async ({ page }) => {
  await page.goto("/publications/");
  await page.getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Research" })
    .click();

  await expect(page).toHaveURL(/\/#research$/);
  const research = page.locator("#research");
  const header = page.locator(".site-header");
  await expect(research).toBeVisible();
  await expect.poll(async () => {
    const targetTop = await research.evaluate((element) => element.getBoundingClientRect().top);
    const headerBottom = await header.evaluate((element) => element.getBoundingClientRect().bottom);
    return targetTop >= headerBottom - 1 && targetTop < await page.evaluate(() => window.innerHeight);
  }).toBe(true);
});

test("the compact header stays pinned while the page scrolls", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const header = page.locator(".site-header");
  const about = page.locator("#about");
  const initialHeader = await header.boundingBox();
  const initialAbout = await about.boundingBox();
  expect(initialHeader).not.toBeNull();
  expect(initialAbout).not.toBeNull();
  expect(initialHeader!.height).toBeLessThanOrEqual(80);
  expect(initialAbout!.y - (initialHeader!.y + initialHeader!.height)).toBeLessThanOrEqual(56);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect.poll(() => header.evaluate((element) => element.getBoundingClientRect().top)).toBeCloseTo(0, 0);
});

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
  await expect(rows).toHaveCount(4);
  await expect(rows.locator(".publication-kicker")).toHaveText([
    "2026 · Preprint",
    "2026 · Preprint",
    "2025 · Survey",
    "2025 · Position paper",
  ]);
  await expect(rows.locator(".publication-kicker")).toContainText(expectedPublicationTypes);
});

test("publication previews use uniform static media with an intentional Position fallback", async ({ page }) => {
  await page.goto("/publications/");

  const rows = page.locator(".publication-row");
  await expect(rows.locator(".paper-figure--uniform")).toHaveCount(4);
  await expect(rows.locator(".paper-figure--uniform img[src$='.svg']")).toHaveCount(3);
  await expect(rows.locator(".paper-figure--fallback")).toHaveCount(1);
  await expect(rows.locator("object, embed, iframe")).toHaveCount(0);
  await expect(rows.locator('[data*=".pdf" i], [src*=".pdf" i], [type*="pdf" i]')).toHaveCount(0);
  const positionRow = page.getByRole("article").filter({
    has: page.getByRole("heading", {
      level: 2,
      name: "Position: The Physics-Physical Reasoning Interplay is Key for Future Embodied World Models",
      exact: true,
    }),
  });
  const positionFallback = positionRow.locator(".paper-figure--fallback");
  await expect(positionFallback).toHaveCount(1);
  await expect(positionFallback.locator("img")).toHaveCount(0);
});

test("publication tabs slide to a centered Featured selection", async ({ page }) => {
  await page.goto("/publications/");

  const filter = page.getByRole("tablist", { name: "Filter publications" });
  await expect(filter.getByRole("tab")).toHaveCount(4);
  await filter.getByRole("tab", { name: "Featured" }).click();
  await expect(filter).toHaveAttribute("data-selected", "featured");
  await expect(page.locator(".publication-row")).toHaveCount(2);
  await expect(page.locator("article .publication-author-legend")).toHaveCount(0);
  const legend = page.locator(".publication-author-legend");
  await expect(legend).toHaveCount(1);
  await expect(legend).toBeVisible();
  const legendStyles = await legend.evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      color: styles.color,
      fontSize: Number.parseFloat(styles.fontSize),
      fontWeight: Number.parseInt(styles.fontWeight, 10),
      opacity: Number.parseFloat(styles.opacity),
    };
  });
  expect(legendStyles.fontSize).toBeGreaterThanOrEqual(14);
  expect(legendStyles.fontWeight).toBeGreaterThanOrEqual(500);
  expect(legendStyles.opacity).toBeGreaterThan(0);
  expect(legendStyles.color).not.toMatch(/^(?:transparent|rgba?\(0(?:,?\s*0){2}(?:,?\s*0)?\))$/i);
});

test("reduced motion disables authored navigation motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/publications/");

  const motionTarget = page.getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Publications" });
  const readMotion = () => motionTarget.evaluate((element) => {
    const styles = getComputedStyle(element);
    const toMilliseconds = (duration: string) =>
      duration.endsWith("ms")
        ? Number.parseFloat(duration)
        : Number.parseFloat(duration) * 1000;
    return {
      animationName: styles.animationName,
      transitionMilliseconds: toMilliseconds(styles.transitionDuration),
    };
  });

  const normalMotion = await readMotion();
  expect(normalMotion.transitionMilliseconds).toBeCloseTo(160);

  await page.emulateMedia({ reducedMotion: "reduce" });
  const reducedMotion = await readMotion();
  expect(reducedMotion.transitionMilliseconds).toBeLessThanOrEqual(0.01);
  expect(reducedMotion.animationName).toBe("none");
});
