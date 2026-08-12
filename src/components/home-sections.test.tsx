import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { NewsItem } from "@/data/types";
import { AboutSection } from "./about-section";
import { ExperienceSection } from "./experience-section";
import { NewsSection } from "./news-section";
import { ResearchSection } from "./research-section";

describe("home sections", () => {
  it("exposes semantic section landmarks with stable IDs", () => {
    const { container } = render(
      <>
        <AboutSection />
        <ResearchSection />
        <ExperienceSection />
        <NewsSection />
      </>,
    );

    for (const id of ["about", "research", "experience", "news"]) {
      expect(container.querySelector(`section#${id}`)).toBeInTheDocument();
    }
  });

  it("renders exactly the three approved research interests", () => {
    render(<ResearchSection />);

    const section = screen.getByRole("region", { name: "Research interests" });
    expect(within(section).getAllByRole("listitem")).toHaveLength(3);
    expect(section).toHaveTextContent("Physical AI");
    expect(section).toHaveTextContent("Physics Reasoning");
    expect(section).toHaveTextContent("Multimodal Evaluation");
  });

  it("renders only the confirmed experience", () => {
    render(<ExperienceSection />);

    const section = screen.getByRole("region", { name: "Academic experience" });
    expect(within(section).getAllByRole("listitem")).toHaveLength(1);
    expect(section).toHaveTextContent("Undergraduate Researcher");
    expect(section).toHaveTextContent("Sun Yat-sen University");
  });

  it("sorts news newest first", () => {
    const items: NewsItem[] = [
      { date: "2024-01-03", title: "Oldest" },
      { date: "2026-04-12", title: "Newest" },
      { date: "2025-07-08", title: "Middle" },
    ];

    render(<NewsSection items={items} />);

    const titles = within(
      screen.getByRole("region", { name: "News updates" }),
    ).getAllByRole("heading", { level: 3 });
    expect(titles.map((title) => title.textContent)).toEqual([
      "Newest",
      "Middle",
      "Oldest",
    ]);
  });

  it("omits empty experience and news sections", () => {
    const { container } = render(
      <>
        <ExperienceSection items={[]} />
        <NewsSection items={[]} />
      </>,
    );

    expect(container.querySelector("#experience")).not.toBeInTheDocument();
    expect(container.querySelector("#news")).not.toBeInTheDocument();
  });
});
