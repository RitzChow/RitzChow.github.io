import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";

describe("home page", () => {
  it("uses a compact About label without the former statement heading", () => {
    render(<Page />);

    expect(screen.getByRole("heading", { level: 2, name: "About" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Ruizhe Zhou" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading").slice(0, 2).map((heading) => heading.textContent)).toEqual([
      "Ruizhe Zhou",
      "About",
    ]);
    expect(
      screen.queryByText("Understanding intelligence through the physical world."),
    ).not.toBeInTheDocument();
  });

  it("keeps research interests in the identity rail instead of the main narrative", () => {
    const { container } = render(<Page />);

    expect(container.querySelector(".home-content #research")).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Research Interests" })).toBeInTheDocument();
  });

  it("orders the home narrative from about and news to education and experience", () => {
    const { container } = render(<Page />);

    expect(
      Array.from(container.querySelectorAll(".home-content > section, .education-experience-grid > section"), (section) => section.id),
    ).toEqual(["about", "news", "education", "experience"]);
    expect(container.querySelector(".education-experience-grid")).toContainElement(
      container.querySelector("#education"),
    );
    expect(container.querySelector(".education-experience-grid")).toContainElement(
      container.querySelector("#experience"),
    );
  });

  it("places the identity rail before the main narrative in document order", () => {
    const { container } = render(<Page />);
    const gridChildren = Array.from(container.querySelector(".home-grid")!.children);

    expect(gridChildren[0]).toHaveClass("identity-rail");
    expect(gridChildren[1]).toHaveClass("home-content");
  });
});
