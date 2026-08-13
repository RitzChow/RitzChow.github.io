import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationsPage, { metadata } from "./page";

describe("publications page", () => {
  it("exports archive metadata", () => {
    expect(metadata.title).toBe("Publications — Ruizhe Zhou");
    expect(metadata.description).toMatch(/publication/i);
  });

  it("omits the former descriptive sentence while preserving the archive hierarchy", () => {
    render(<PublicationsPage />);

    expect(screen.getByText("Research archive")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Publications" })).toBeInTheDocument();
    expect(screen.queryByText("Selected work on intelligence grounded in physical systems and reliable language technologies.")).not.toBeInTheDocument();
  });
});
