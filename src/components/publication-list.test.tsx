import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Publication } from "@/data/types";
import { publications } from "@/data/publications";
import { PaperFigure } from "./paper-figure";
import { PublicationList, sortPublicationsNewestFirst } from "./publication-list";

const fixture: Publication = {
  id: "fixture-paper",
  title: "A Fixture Paper",
  authors: [
    { name: "First Author", equalContribution: true },
    { name: "Ruizhe Zhou", equalContribution: true },
    { name: "Last Author", correspondingAuthor: true },
  ],
  year: 2025,
  publicationType: "Survey",
  venue: "Test Conference",
  category: "physical-ai",
  tldr: "A short explanation of the contribution.",
  award: "Best Paper Honorable Mention",
  bibtex: "@article{fixture, title={A Fixture Paper}}",
  links: {
    paper: "https://example.com/paper",
    scholar: "https://scholar.google.com/example",
    code: "https://example.com/code",
  },
  filterGroups: ["physical"],
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
    expect(article).toHaveTextContent("2025 · Survey");
    expect(article).not.toHaveTextContent("Physical AI · 2025");
    expect(article).toHaveTextContent(fixture.venue);
    expect(article).toHaveTextContent(fixture.tldr!);
    expect(article).toHaveTextContent(fixture.award!);
    expect(within(article!).getAllByLabelText("Equal contribution")).toHaveLength(2);
    expect(within(article!).getByLabelText("Corresponding author")).toHaveTextContent("†");
    expect(article).not.toHaveTextContent("* Equal contribution · † Corresponding author");
  });

  it("omits contribution marks and legend when none are confirmed", () => {
    const unmarked = {
      ...fixture,
      authors: fixture.authors.map(({ name }) => ({ name })),
    };

    const { container } = render(<PublicationList publications={[unmarked]} />);

    expect(container.querySelector(".publication-author-mark")).not.toBeInTheDocument();
    expect(screen.queryByText("* Equal contribution · † Corresponding author")).not.toBeInTheDocument();
  });

  it("only renders configured links and omits empty BibTeX actions", () => {
    render(<PublicationList publications={[{ ...fixture, bibtex: undefined }]} />);

    const paper = screen.getByRole("link", { name: "Paper (opens in a new tab)" });
    const code = screen.getByRole("link", { name: "Code (opens in a new tab)" });
    const scholar = screen.getByRole("link", { name: "Scholar (opens in a new tab)" });
    expect(paper).toHaveAttribute("target", "_blank");
    expect(code).toHaveAttribute("rel", "noreferrer");
    expect(scholar).toHaveAttribute("href", fixture.links.scholar);
    expect(paper).toHaveTextContent(/^Paper ↗$/);
    expect(code).toHaveTextContent(/^Code ↗$/);
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

describe("publication data", () => {
  it("contains exactly the four current papers and excludes LLM-Detector", () => {
    expect(publications).toHaveLength(4);
    expect(publications.map(({ title }) => title)).toEqual([
      "Aligning Perception, Reasoning, Modeling and Interaction: A Survey on Physical AI",
      "When Prompts Become Pixels: Prompt-Region Grounding for Multimodal Reasoning",
      "Models Under SCOPE: Scalable and Controllable Routing via Pre-hoc Reasoning",
      "Position: The Physics-Physical Reasoning Interplay is Key for Future Embodied World Models",
    ]);
    expect(publications.some(({ title }) => title.includes("LLM-Detector"))).toBe(false);
  });

  it("stores confirmed metadata, media, grouping, and author roles", () => {
    const [survey, visual, scope, position] = publications;

    expect(survey).toMatchObject({
      year: 2025,
      pdfMedia: "/image/physical-ai-survey.pdf",
      filterGroups: ["physical"],
    });
    expect(survey.authors.slice(0, 3)).toEqual([
      { name: "Kun Xiang", equalContribution: true },
      { name: "Terry Jingchen Zhang", equalContribution: true },
      { name: "Yinya Huang", equalContribution: true },
    ]);
    expect(survey.authors.at(-1)).toEqual({
      name: "Xiaodan Liang",
      correspondingAuthor: true,
    });

    expect(visual).toMatchObject({
      year: 2026,
      publicationType: "Preprint",
      venue: "arXiv",
      pdfMedia: "/image/when-prompts-become-pixels.pdf",
      filterGroups: ["visual"],
    });
    expect(visual.authors.map(({ name }) => name)).toEqual([
      "Yongxin Wang", "Ruizhe Zhou", "Yueling Tang", "Yingying Zhu",
      "Xuemin Zhao", "Xiaojun Chang", "Xiaodan Liang",
    ]);
    expect(visual.authors.some(({ equalContribution, correspondingAuthor }) =>
      equalContribution || correspondingAuthor)).toBe(false);

    expect(scope).toMatchObject({
      year: 2026,
      publicationType: "Preprint",
      venue: "arXiv",
      pdfMedia: "/image/models-under-scope.pdf",
    });
    expect(scope).not.toHaveProperty("filterGroups");
    expect(scope.authors.map(({ name }) => name)).toEqual([
      "Qi Cao", "Shuhao Zhang", "Ruizhe Zhou", "Ruiyi Zhang", "Peijia Qin",
      "Pengtao Xie",
    ]);

    expect(position).toMatchObject({
      year: 2025,
      venue: "NeurIPS LAW Workshop",
      filterGroups: ["physical"],
    });
    expect(position).not.toHaveProperty("pdfMedia");
    expect(position.authors.slice(0, 3).every(({ equalContribution }) => equalContribution)).toBe(true);
    expect(position.authors.at(-1)).toEqual({
      name: "Xiaodan Liang",
      correspondingAuthor: true,
    });
  });
});

describe("PaperFigure", () => {
  it("embeds vector PDF media directly with a base-path-safe fallback link", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/portfolio");
    const { container } = render(
      <PaperFigure
        title="A Fixture Paper"
        category="physical-ai"
        pdfMedia="/image/fixture.pdf"
        mediaAspectRatio={16 / 9}
      />,
    );

    const object = container.querySelector("object");
    expect(object).toHaveAttribute("type", "application/pdf");
    expect(object).toHaveAttribute("data", "/portfolio/image/fixture.pdf");
    expect(object).toHaveAccessibleName("Vector preview of A Fixture Paper");
    expect(container.querySelector("figure")).toHaveStyle({ aspectRatio: `${16 / 9}` });
    const fallback = screen.getByRole("link", { name: "Open vector PDF (opens in a new tab)" });
    expect(fallback).toHaveAttribute("href", "/portfolio/image/fixture.pdf");
    expect(fallback).toHaveAttribute("target", "_blank");
    vi.unstubAllEnvs();
  });

  it("keeps the Position paper on its deterministic fallback instead of an object", () => {
    const { container } = render(
      <PaperFigure title="Position paper" category="world-models" />,
    );

    expect(container.querySelector("object")).not.toBeInTheDocument();
    expect(container.querySelector('[data-figure-category="world-models"]')).toBeInTheDocument();
  });

  it("gives the physical-AI fallback a distinct embodied-system motif", () => {
    const { container } = render(
      <PaperFigure title="A Fixture Paper" category="physical-ai" />,
    );

    expect(container.querySelector(".paper-figure--physical-ai")).toBeInTheDocument();
    expect(container.querySelector(".paper-figure__core")).toBeInTheDocument();
  });

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
