import { afterEach, describe, expect, it } from "vitest";
import { sitePath } from "./site-path";

describe("sitePath", () => {
  const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH;

  afterEach(() => {
    process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath;
  });

  it("prefixes root-relative static images for a project Pages deployment", () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/portfolio";
    expect(sitePath("/papers/figure.png")).toBe("/portfolio/papers/figure.png");
  });

  it("does not prefix external, relative, or already-prefixed paths", () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/portfolio";
    expect(sitePath("https://example.com/figure.png")).toBe("https://example.com/figure.png");
    expect(sitePath("papers/figure.png")).toBe("papers/figure.png");
    expect(sitePath("/portfolio/papers/figure.png")).toBe("/portfolio/papers/figure.png");
  });
});
