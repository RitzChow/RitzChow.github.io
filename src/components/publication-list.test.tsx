import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Publication } from "@/data/types";
import { PaperFigure } from "./paper-figure";
import { PublicationList, sortPublicationsNewestFirst } from "./publication-list";

const fixture: Publication = {
  id: "fixture-paper",
  title: "A Fixture Paper",
  authors: ["First Author", "Ruizhe Zhou", "Last Author"],
  year: 2025,
  venue: "Test Conference",
  category: "physical-ai",
  tldr: "A short explanation of the contribution.",
  award: "Best Paper Honorable Mention",
  bibtex: "@article{fixture, title={A Fixture Paper}}",
  links: {
    paper: "https://example.com/paper",
    code: "https://example.com/code",
  },
};

describe("publication archive", () => {
  afterEach(() => vi.restoreAllMocks());

  it("sorts newest first while preserving source order within a year", () => {
    const publications = [
      { ...fixture, id: "old", year: 2023 },
      { ...fixture, id: "new-first", year: 2025 },
      { ...fixture, id: "new-second", year: 2025 },
    ];

    expect(sortPublicationsNewestFirst(publications).map((item) => item.id)).toEqual([
      "new-first",
      "new-second",
      "old",
    ]);
    expect(publications.map((item) => item.id)).toEqual(["old", "new-first", "new-second"]);
  });

  it("renders semantic editorial rows and optional publication details", () => {
    const { container } = render(<PublicationList publications={[fixture]} />);

    const article = container.querySelector("article");
    expect(article).toBeInTheDocument();
    expect(within(article!).getByRole("heading", { name: fixture.title })).toBeInTheDocument();
    expect(within(article!).getByText("Ruizhe Zhou").tagName).toBe("STRONG");
    expect(within(article!).getByText("Ruizhe Zhou")).toHaveClass("publication-author--self");
    expect(article).toHaveTextContent("Physical AI · 2025");
    expect(article).toHaveTextContent(fixture.venue);
    expect(article).toHaveTextContent(fixture.tldr!);
    expect(article).toHaveTextContent(fixture.award!);
  });

  it("only renders configured links and omits empty BibTeX actions", () => {
    render(<PublicationList publications={[{ ...fixture, bibtex: undefined }]} />);

    expect(screen.getByRole("link", { name: "Paper" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Code" })).toHaveAttribute("rel", "noreferrer");
    expect(screen.queryByRole("link", { name: "Project" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /bibtex/i })).not.toBeInTheDocument();
  });

  it("discloses and copies BibTeX with polite confirmation", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<PublicationList publications={[fixture]} />);

    await user.click(screen.getByRole("button", { name: "Show BibTeX" }));
    expect(screen.getByText(fixture.bibtex!)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Copy BibTeX" }));

    expect(writeText).toHaveBeenCalledWith(fixture.bibtex);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("status")).toHaveTextContent("BibTeX copied.");
  });

  it("reports clipboard failure without crashing", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    render(<PublicationList publications={[fixture]} />);

    await user.click(screen.getByRole("button", { name: "Show BibTeX" }));
    await user.click(screen.getByRole("button", { name: "Copy BibTeX" }));

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Could not copy BibTeX. Please select and copy it manually.",
      ),
    );
  });
});

describe("PaperFigure", () => {
  it("uses a deterministic category fallback when no image is configured", () => {
    const { container } = render(
      <PaperFigure title="A Fixture Paper" category="world-models" />,
    );

    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(container.querySelector('[data-figure-category="world-models"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("replaces a failed image with the category fallback", () => {
    const { container } = render(
      <PaperFigure
        title="A Fixture Paper"
        category="text-detection"
        image="/papers/fixture.png"
        imageAlt="A comparison chart from A Fixture Paper"
      />,
    );

    const image = screen.getByRole("img", { name: "A comparison chart from A Fixture Paper" });
    fireEvent.error(image);
    expect(container.querySelector('[data-figure-category="text-detection"]')).toBeInTheDocument();
  });
});
