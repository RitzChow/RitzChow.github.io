import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

type LogoSource = {
  archiveMember?: string;
  file: string;
  institution: string;
  referenceUrl?: string;
  sha256: string;
  sourceUrl: string;
};

const root = resolve(import.meta.dirname, "../..");
const expectedFiles = ["sysu-logo.svg", "unc-logo.svg", "uc-san-diego-logo.svg"];
const vectorFiles = ["sysu-logo.svg", "unc-logo.svg", "uc-san-diego-logo.svg"];
const approvedHosts = new Set(["applyforchina.com", "scholarrx.com", "ucsd.edu", "brand.ucsd.edu"]);

describe("approved university logo assets", () => {
  const manifestPath = resolve(root, "public/image/university-logo-sources.json");

  it("documents the approved source for every local logo", () => {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as LogoSource[];

    expect(manifest.map(({ file }) => file).sort()).toEqual([...expectedFiles].sort());
    expect(manifest.every(({ institution }) => institution.trim().length > 0)).toBe(true);
    expect(manifest.every(({ sourceUrl }) => {
        if (sourceUrl === "user-provided") return true;
        const url = new URL(sourceUrl);
        return url.protocol === "https:" && approvedHosts.has(url.hostname);
    })).toBe(true);
    expect(manifest.find(({ file }) => file === "sysu-logo.svg")?.referenceUrl).toBe("中山大学-emblem-010.png");
    expect(manifest.find(({ file }) => file === "unc-logo.svg")?.referenceUrl).toBe(
      "the-university-of-north-carolina-at-chapel-hill-logo-vector.svg",
    );
    expect(manifest.find(({ file }) => file === "uc-san-diego-logo.svg")?.archiveMember).toBe(
      "UC San Diego Logo Kit 2024/SVG for Canva/UCSanDiegoLogo-BlueGold.svg",
    );
  });

  it("pins every approved asset to its reviewed SHA-256 digest", () => {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as LogoSource[];

    for (const { file, sha256 } of manifest) {
      const asset = readFileSync(resolve(root, "public/image", file));
      expect(createHash("sha256").update(asset).digest("hex"), file).toBe(sha256);
    }
  });

  it.each(vectorFiles)("keeps %s as a safe, self-contained vector SVG", (file) => {
    const svg = readFileSync(resolve(root, "public/image", file), "utf8");

    expect(svg).toMatch(/^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i);
    expect(svg).toMatch(/\bviewBox\s*=\s*["'][^"']+["']/i);
    expect(svg).toMatch(/<(?:path|polygon|polyline|rect|circle|ellipse)\b/i);
    expect(svg).not.toMatch(/<!DOCTYPE|<!ENTITY/i);
    expect(svg).not.toMatch(/<(?:script|foreignObject|iframe|object|embed|image|use)\b/i);
    expect(svg).not.toMatch(/\s+on[a-z][\w:-]*\s*=/i);
    expect(svg).not.toMatch(/@import|url\s*\(/i);
    expect(svg).not.toMatch(/\s+(?:href|src|xlink:href)\s*=/i);

    const elements = [...svg.matchAll(/<\/?([A-Za-z][\w:-]*)\b/g)].map((match) => match[1]);
    expect([...new Set(elements)].every((element) => ["svg", "defs", "style", "g", "path", "line"].includes(element))).toBe(true);
  });
});
