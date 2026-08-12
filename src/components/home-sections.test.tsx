import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { NewsItem, Profile } from "@/data/types";
import { AboutSection } from "./about-section";
import { ExperienceSection } from "./experience-section";
import { NewsSection } from "./news-section";
import { ResearchSection } from "./research-section";

describe("home sections", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  it("renders about copy from the supplied profile", () => {
    const customProfile: Profile = {
      name: "Test Researcher",
      role: "Visiting Researcher",
      institution: "Test Institute",
      bio: "A custom biography from the profile data source.",
      contacts: [],
    };

    render(<AboutSection data={customProfile} />);

    const section = screen.getByRole("region", {
      name: "Understanding intelligence through the physical world.",
    });
    expect(section).toHaveTextContent(customProfile.bio);
    expect(section).not.toHaveTextContent("Visiting Researcher at Test Institute");
    expect(section).not.toHaveTextContent("physical AI");
  });

  it("renders only the confirmed experience", () => {
    render(<ExperienceSection />);

    const section = screen.getByRole("region", { name: "Academic experience" });
    expect(within(section).getAllByRole("listitem")).toHaveLength(1);
    expect(section).toHaveTextContent("Undergraduate Researcher");
    expect(section).toHaveTextContent("Sun Yat-sen University");
  });

  it("labels configured lab, advisor, and project experience details", () => {
    render(
      <ExperienceSection
        items={[{
          role: "Research Assistant",
          institution: "Test University",
          lab: "Embodied Intelligence Lab",
          advisor: "Prof. Ada Example",
          project: "World Model Evaluation",
        }]}
      />,
    );

    const section = screen.getByRole("region", { name: "Academic experience" });
    expect(within(section).getByText("Lab")).toBeInTheDocument();
    expect(within(section).getByText("Embodied Intelligence Lab")).toBeInTheDocument();
    expect(within(section).getByText("Advisor")).toBeInTheDocument();
    expect(within(section).getByText("Prof. Ada Example")).toBeInTheDocument();
    expect(within(section).getByText("Project")).toBeInTheDocument();
    expect(within(section).getByText("World Model Evaluation")).toBeInTheDocument();
  });

  it("omits labels for unconfigured experience details", () => {
    render(<ExperienceSection items={[{ role: "Researcher", institution: "Test University" }]} />);

    const section = screen.getByRole("region", { name: "Academic experience" });
    expect(within(section).queryByText("Lab")).not.toBeInTheDocument();
    expect(within(section).queryByText("Advisor")).not.toBeInTheDocument();
    expect(within(section).queryByText("Project")).not.toBeInTheDocument();
  });

  it("sorts news newest first", () => {
    const items: NewsItem[] = [
      { date: "2024-01-03", title: "Oldest" },
      { date: "2026-04-12", title: "Newest" },
      { date: "2025-07-08", title: "Middle" },
    ];

    render(<NewsSection items={items} />);

    const titles = screen.getAllByRole("heading", { level: 3 });
    expect(titles.map((title) => title.textContent)).toEqual([
      "Newest",
      "Middle",
      "Oldest",
    ]);
  });

  it("does not make a non-overflowing desktop news list a focus stop", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );
    render(<NewsSection items={[{ date: "2026-04-12", title: "One item" }]} />);

    const list = screen.getByRole("list");
    Object.defineProperties(list.parentElement, {
      clientHeight: { configurable: true, value: 400 },
      scrollHeight: { configurable: true, value: 300 },
    });
    fireEvent(window, new Event("resize"));

    await waitFor(() =>
      expect(list.parentElement).not.toHaveAttribute("tabindex"),
    );
    expect(list.parentElement).not.toHaveAttribute("tabindex");
    expect(list.parentElement).not.toHaveAttribute("role", "region");
  });

  it("makes a long desktop news list keyboard-scrollable", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );
    const items = Array.from({ length: 2 }, (_, index) => ({
      date: `2026-04-${String(index + 1).padStart(2, "0")}`,
      title: `Update ${index + 1}`,
    }));

    render(<NewsSection items={items} />);

    const list = screen.getByRole("list");
    Object.defineProperties(list.parentElement, {
      clientHeight: { configurable: true, value: 400 },
      scrollHeight: { configurable: true, value: 600 },
    });
    fireEvent(window, new Event("resize"));

    await waitFor(() =>
      expect(screen.getByRole("region", { name: "News updates" })).toHaveAttribute(
        "tabindex",
        "0",
      ),
    );
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
