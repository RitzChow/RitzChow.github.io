import { expect, test } from "@playwright/test";

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

test("the one-item news viewport is keyboard-scrollable when it overflows", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#news");

  const feed = page.locator(".news-feed");
  await expect(feed).toHaveAttribute("tabindex", "0");
  await expect(feed).toHaveAttribute("role", "region");
  await expect(feed).toHaveAttribute("aria-label", "News updates");
  await feed.focus();
  await expect(feed).toBeFocused();
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

test("the Education navigation item lands on its home section", async ({ page }) => {
  await page.goto("/publications/");
  await page.getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Education" })
    .click();

  await expect(page).toHaveURL(/\/#education$/);
  const education = page.locator("#education");
  const header = page.locator(".site-header");
  await expect(education).toBeVisible();
  await expect.poll(async () => {
    const targetTop = await education.evaluate((element) => element.getBoundingClientRect().top);
    const headerBottom = await header.evaluate((element) => element.getBoundingClientRect().bottom);
    return targetTop >= headerBottom - 1 && targetTop < await page.evaluate(() => window.innerHeight);
  }).toBe(true);
});

test("desktop navigation and institution columns match the confirmed architecture", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const primary = page.getByRole("navigation", { name: "Primary" });
  await expect(primary.locator("a:not([aria-label^='CV'])")).toHaveText([
    "About",
    "Publications",
    "Education",
    "Experience",
    "News",
  ]);
  await expect(primary.getByRole("link", { name: "Research" })).toHaveCount(0);

  const education = page.locator("#education");
  const experience = page.locator("#experience");
  const [educationBox, experienceBox] = await Promise.all([
    education.boundingBox(),
    experience.boundingBox(),
  ]);
  expect(educationBox).not.toBeNull();
  expect(experienceBox).not.toBeNull();
  expect(Math.abs(educationBox!.y - experienceBox!.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(educationBox!.width - experienceBox!.width)).toBeLessThanOrEqual(1);

  const logos = page.locator(".institution-row__logo");
  await expect(logos).toHaveCount(3);
  for (const logo of await logos.all()) {
    await expect(logo).toBeVisible();
    const fit = await logo.evaluate((element) => {
      const style = getComputedStyle(element);
      return [style.objectFit, style.objectPosition];
    });
    expect(fit[0]).toBe("contain");
    expect(["left 50%", "0% 50%"]).toContain(fit[1]);
  }
});

test("institution columns stack cleanly on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const educationBox = await page.locator("#education").boundingBox();
  const experienceBox = await page.locator("#experience").boundingBox();
  expect(educationBox).not.toBeNull();
  expect(experienceBox).not.toBeNull();
  expect(experienceBox!.y).toBeGreaterThan(educationBox!.y + educationBox!.height - 1);
  await expectNoHorizontalOverflow(page);
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
  const kickers = await rows.locator(".publication-kicker").allTextContents();
  expect(kickers).toHaveLength(4);
  expect(kickers.every((kicker) => /^20\d{2} · .+/.test(kicker))).toBe(true);
  const years = kickers.map((kicker) => Number.parseInt(kicker, 10));
  expect(years).toEqual([...years].sort((left, right) => right - left));
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
  const featuredRows = page.locator(".publication-row");
  await expect(featuredRows).not.toHaveCount(0);
  expect(await featuredRows.count()).toBeLessThan(4);
  await expect(page.locator("article .publication-author-legend")).toHaveCount(0);
  const legend = page.locator(".publication-author-legend");
  await expect(legend).toHaveCount(1);
  await expect(legend).toBeVisible();
  const legendStyles = await legend.evaluate((element) => {
    const styles = getComputedStyle(element);
    type Rgba = [number, number, number, number];
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Canvas color parsing is unavailable");

    const parseColor = (color: string): Rgba => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
      return [red, green, blue, alpha / 255];
    };
    const composite = (foreground: Rgba, background: Rgba): Rgba => {
      const alpha = foreground[3] + background[3] * (1 - foreground[3]);
      if (alpha === 0) return [0, 0, 0, 0];
      return [
        (foreground[0] * foreground[3] + background[0] * background[3] * (1 - foreground[3])) / alpha,
        (foreground[1] * foreground[3] + background[1] * background[3] * (1 - foreground[3])) / alpha,
        (foreground[2] * foreground[3] + background[2] * background[3] * (1 - foreground[3])) / alpha,
        alpha,
      ];
    };
    const luminance = ([red, green, blue]: Rgba) => {
      const linearize = (channel: number) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
    };

    const ancestors: Element[] = [];
    for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
      ancestors.push(ancestor);
    }
    let background: Rgba = [255, 255, 255, 1];
    for (const ancestor of ancestors.reverse()) {
      background = composite(parseColor(getComputedStyle(ancestor).backgroundColor), background);
    }

    let effectiveOpacity = Number.parseFloat(styles.opacity);
    for (const ancestor of ancestors) {
      effectiveOpacity *= Number.parseFloat(getComputedStyle(ancestor).opacity);
    }
    const foreground = parseColor(styles.color);
    foreground[3] *= effectiveOpacity;
    const paintedForeground = composite(foreground, background);
    const lighter = Math.max(luminance(paintedForeground), luminance(background));
    const darker = Math.min(luminance(paintedForeground), luminance(background));

    return {
      color: styles.color,
      contrastRatio: (lighter + 0.05) / (darker + 0.05),
      fontSize: Number.parseFloat(styles.fontSize),
      fontWeight: Number.parseInt(styles.fontWeight, 10),
      opacity: effectiveOpacity,
    };
  });
  expect(legendStyles.fontSize).toBeGreaterThanOrEqual(14);
  expect(legendStyles.fontWeight).toBeGreaterThanOrEqual(500);
  expect(legendStyles.opacity).toBeGreaterThanOrEqual(0.75);
  expect(legendStyles.color).not.toMatch(/^(?:transparent|rgba?\(0(?:,?\s*0){2}(?:,?\s*0)?\))$/i);
  expect(legendStyles.contrastRatio).toBeGreaterThanOrEqual(4.5);
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
