import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";

describe("home page", () => {
  it("presents the academic statement as the main heading", () => {
    render(<Page />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Understanding intelligence through the physical world.",
      }),
    ).toBeInTheDocument();
  });

  it("orders the home narrative from about and news to research and experience", () => {
    const { container } = render(<Page />);

    expect(
      Array.from(container.querySelectorAll(".home-content > section"), (section) => section.id),
    ).toEqual(["about", "news", "research", "experience"]);
  });
});
