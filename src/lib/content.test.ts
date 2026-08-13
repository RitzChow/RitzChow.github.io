import { describe, expect, it } from "vitest";
import {
  definedLinks,
  normalizeContactHref,
  sortNews,
  sortPublications,
} from "./content";

describe("normalizeContactHref", () => {
  it("turns a raw email address into a mailto link", () => {
    expect(normalizeContactHref("z1459306087@gmail.com")).toBe(
      "mailto:z1459306087@gmail.com",
    );
  });

  it("preserves an already usable contact URL", () => {
    expect(normalizeContactHref("  https://github.com/RitzChow  ")).toBe(
      "https://github.com/RitzChow",
    );
  });

  it("preserves an existing mailto link", () => {
    expect(normalizeContactHref("  mailto:ritz@example.com  ")).toBe(
      "mailto:ritz@example.com",
    );
  });

  it("rejects unsafe and unsupported URL schemes", () => {
    expect(normalizeContactHref("javascript:alert(1)")).toBe("");
    expect(normalizeContactHref("ftp://example.com/profile")).toBe("");
  });
});

describe("definedLinks", () => {
  it("removes links whose href is empty", () => {
    const links = [
      { label: "GitHub", href: "https://github.com/RitzChow" },
      { label: "Email", href: "" },
      { label: "LinkedIn", href: "   " },
    ];

    expect(definedLinks(links)).toEqual([links[0]]);
    expect(links).toHaveLength(3);
  });
});

describe("sortNews", () => {
  it("sorts ISO dates newest first without changing the source array", () => {
    const items = [{ date: "2025-01-01" }, { date: "2026-01-01" }];

    expect(sortNews(items).map(({ date }) => date)).toEqual([
      "2026-01-01",
      "2025-01-01",
    ]);
    expect(items.map(({ date }) => date)).toEqual(["2025-01-01", "2026-01-01"]);
  });
});

describe("sortPublications", () => {
  it("sorts by descending year and preserves source order within a year", () => {
    const publications = [
      { id: "older", year: 2024 },
      { id: "first-new", year: 2025 },
      { id: "second-new", year: 2025 },
    ];

    expect(sortPublications(publications).map(({ id }) => id)).toEqual([
      "first-new",
      "second-new",
      "older",
    ]);
    expect(publications.map(({ id }) => id)).toEqual([
      "older",
      "first-new",
      "second-new",
    ]);
  });
});
