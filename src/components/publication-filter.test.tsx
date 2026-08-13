import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { publications } from "@/data/publications";
import { PublicationArchive } from "./publication-filter";

const titles = publications.map(({ title }) => title);

function renderedTitles() {
  return screen.getAllByRole("article").map((article) =>
    within(article).getByRole("heading", { level: 2 }).textContent,
  );
}

describe("PublicationArchive", () => {
  it("selects All by default and keeps the stable newest-first order", () => {
    const { container } = render(<PublicationArchive publications={publications} />);

    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute("aria-selected", "true");
    expect(container.querySelector(".publication-filter")).toHaveAttribute("data-selected", "all");
    expect(screen.getByText("* Equal contribution · † Corresponding author")).toBeInTheDocument();
    expect(renderedTitles()).toEqual([titles[1], titles[2], titles[0], titles[3]]);
  });

  it("filters Physical and Visual without showing an empty category", async () => {
    const user = userEvent.setup();
    render(<PublicationArchive publications={publications} />);

    await user.click(screen.getByRole("tab", { name: "Physical" }));
    expect(renderedTitles()).toEqual([titles[0], titles[3]]);
    expect(screen.queryByText(titles[2])).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Visual" }));
    expect(renderedTitles()).toEqual([titles[1]]);
    expect(screen.queryByText(titles[2])).not.toBeInTheDocument();
    expect(document.querySelector(".publication-filter")).toHaveAttribute("data-selected", "visual");
  });

  it("shows the representative Physical and Visual works under Featured", async () => {
    const user = userEvent.setup();
    render(<PublicationArchive publications={publications} />);

    await user.click(screen.getByRole("tab", { name: "Featured" }));
    expect(renderedTitles()).toEqual([titles[1], titles[0]]);
    expect(document.querySelector(".publication-filter")).toHaveAttribute("data-selected", "featured");
  });

  it("supports ArrowLeft, ArrowRight, Home, and End with selected-state semantics", async () => {
    const user = userEvent.setup();
    render(<PublicationArchive publications={publications} />);

    const all = screen.getByRole("tab", { name: "All" });
    const featured = screen.getByRole("tab", { name: "Featured" });
    const physical = screen.getByRole("tab", { name: "Physical" });
    const visual = screen.getByRole("tab", { name: "Visual" });

    all.focus();
    await user.keyboard("{ArrowRight}");
    expect(featured).toHaveFocus();
    expect(featured).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{End}");
    expect(visual).toHaveFocus();
    expect(visual).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowLeft}");
    expect(physical).toHaveFocus();
    await user.keyboard("{Home}");
    expect(all).toHaveFocus();
    expect(all).toHaveAttribute("aria-selected", "true");
  });
});
