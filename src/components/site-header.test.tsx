import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RoughMark } from "./rough-mark";
import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  it("renders the primary navigation labels and hides an empty CV link", () => {
    render(<SiteHeader cv="" />);

    for (const label of ["About", "Research", "Publications", "Experience", "News"]) {
      expect(screen.getAllByRole("link", { name: label }).length).toBeGreaterThan(0);
    }
    expect(screen.queryByRole("link", { name: "CV" })).not.toBeInTheDocument();
  });

  it("renders a configured CV as an external new-tab link", () => {
    render(<SiteHeader cv="https://example.com/cv.pdf" />);

    for (const link of screen.getAllByRole("link", { name: "CV" })) {
      expect(link).toHaveAttribute("href", "https://example.com/cv.pdf");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    }
  });

  it("opens and closes the mobile navigation", async () => {
    const user = userEvent.setup();
    render(<SiteHeader cv="" />);

    const button = screen.getByRole("button", { name: "Open navigation" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeVisible();

    await user.click(screen.getByRole("navigation", { name: "Mobile" }).querySelector("a")!);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });
});

describe("RoughMark", () => {
  it("is decorative and uses a stable path for each variant", () => {
    const { container, rerender } = render(<RoughMark variant="underline" />);
    const underline = container.querySelector("svg");
    const underlinePath = container.querySelector("path")?.getAttribute("d");

    expect(underline).toHaveAttribute("aria-hidden", "true");
    expect(underlinePath).toBeTruthy();

    rerender(<RoughMark variant="arrow" />);
    expect(container.querySelector("path")?.getAttribute("d")).not.toBe(underlinePath);

    rerender(<RoughMark variant="underline" />);
    expect(container.querySelector("path")?.getAttribute("d")).toBe(underlinePath);
  });
});
