import { describe, expect, it } from "vitest";
import { metadata } from "./page";

describe("publications page", () => {
  it("exports archive metadata", () => {
    expect(metadata.title).toBe("Publications — Ruizhe Zhou");
    expect(metadata.description).toMatch(/publication/i);
  });
});
