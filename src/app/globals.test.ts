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
});
