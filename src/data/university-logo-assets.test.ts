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
const expectedFiles = ["sysu-logo.gif", "unc-logo.svg", "uc-san-diego-logo.svg"];
const vectorFiles = ["unc-logo.svg", "uc-san-diego-logo.svg"];
const officialHosts = new Set(["sysu.edu.cn", "www.sysu.edu.cn", "unc.edu", "www.unc.edu", "identity.unc.edu", "ucsd.edu", "brand.ucsd.edu"]);
const approvedRasterSource = "https://applyforchina.com/wp-content/uploads/2024/10/Sun-Yat-sen-University.gif";

describe("approved university logo assets", () => {
  const manifestPath = resolve(root, "public/image/university-logo-sources.json");

  it("documents the approved source for every local logo", () => {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as LogoSource[];

    expect(manifest.map(({ file }) => file).sort()).toEqual([...expectedFiles].sort());
    expect(manifest.every(({ institution }) => institution.trim().length > 0)).toBe(true);
    expect(manifest.every(({ sourceUrl }) => {
        const url = new URL(sourceUrl);
        return url.protocol === "https:" && (officialHosts.has(url.hostname) || sourceUrl === approvedRasterSource);
    })).toBe(true);
    expect(manifest.find(({ file }) => file === "sysu-logo.gif")?.referenceUrl).toBe(
      "https://applyforchina.com/ru/universities/sun-yat-sen-university/",
    );
    expect(manifest.find(({ file }) => file === "unc-logo.svg")?.referenceUrl).toBe(
      "https://scholarrx.com/supporting-student-centered-learning-through-formative-assessments/unc-logo/",
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
    expect(new Set(elements)).toEqual(new Set(["svg", "defs", "style", "g", "path", ...(file === "unc-logo.svg" ? ["rect"] : [])]));
  });

  it("keeps the approved SYSU raster asset as the original 381 by 130 GIF", () => {
    const gif = readFileSync(resolve(root, "public/image/sysu-logo.gif"));

    expect(gif.subarray(0, 6).toString("ascii")).toMatch(/^GIF8[79]a$/);
    expect(gif.readUInt16LE(6)).toBe(381);
    expect(gif.readUInt16LE(8)).toBe(130);
  });
});
