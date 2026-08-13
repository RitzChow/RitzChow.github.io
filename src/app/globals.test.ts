import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("global layout styles", () => {
  it("keeps the site header pinned to an opaque paper surface", () => {
    const headerRule = css.match(/\.site-header\s*{([^}]*)}/)?.[1] ?? "";

    expect(headerRule).toMatch(/position:\s*sticky/);
    expect(headerRule).toMatch(/top:\s*0/);
    expect(headerRule).toMatch(/z-index:\s*\d+/);
    expect(headerRule).toMatch(/background(?:-color)?:\s*(?:var\(--paper\)|rgb\()/);
    expect(headerRule).toMatch(/border-bottom:/);
  });

  it("reserves sticky-header clearance for home anchors", () => {
    const sectionRule = css.match(/\.home-section\s*{([^}]*)}/)?.[1] ?? "";

    expect(sectionRule).toMatch(/scroll-margin-top:\s*(?:calc\(|clamp\(|[5-9](?:\.\d+)?rem)/);
  });

  it("uses a square, lightly offset editorial frame for the portrait", () => {
    const portraitRule = css.match(/\.identity-portrait\s*{([^}]*)}/)?.[1] ?? "";
    const imageRule = css.match(/\.identity-portrait__image\s*{([^}]*)}/)?.[1] ?? "";

    expect(portraitRule).toMatch(/aspect-ratio:\s*1(?:\s*\/\s*1)?/);
    expect(portraitRule).not.toMatch(/border-radius|box-shadow/);
    expect(imageRule).toMatch(/object-fit:\s*cover/);
    expect(css).toMatch(/\.identity-portrait-frame::(?:before|after)/);
    expect(css).toMatch(/transform:\s*translate\(/);
  });

  it("aligns the desktop rail and About section with shared grid padding", () => {
    const gridRule = css.match(/\.home-grid\s*{([^}]*)}/)?.[1] ?? "";
    const contentRule = css.match(/\.home-content\s*{([^}]*)}/)?.[1] ?? "";
    const railRule = css.match(/\.identity-rail\s*{([^}]*)}/)?.[1] ?? "";
    const mobileRule = css.match(/@media \(max-width:\s*760px\)[\s\S]*?\.home-grid\s*{([^}]*)}/)?.[1] ?? "";

    expect(gridRule).toMatch(/padding-top:\s*clamp\(/);
    expect(contentRule).not.toMatch(/padding-top:/);
    expect(railRule).not.toMatch(/padding-top:/);
    expect(mobileRule).toMatch(/padding-top:\s*0/);
  });
});
