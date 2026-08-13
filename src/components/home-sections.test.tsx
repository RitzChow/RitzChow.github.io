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

    const rows = screen.getAllByRole("listitem");
    expect(rows.map((row) => row.textContent)).toEqual([
      "2026-04-12Newest",
      "2025-07-08Middle",
      "2024-01-03Oldest",
    ]);
  });

  it("uses only the small News heading and renders updates as plain body copy", () => {
    render(
      <NewsSection
        items={[
          {
            date: "2026-04-12",
            title: "Linked title",
            description: "The update body.",
            href: "https://example.com/update",
          },
        ]}
      />,
    );

    const section = screen.getByRole("region", { name: "News" });
    expect(within(section).getByRole("heading", { level: 2, name: "News" })).toHaveClass(
      "section-label",
    );
    expect(within(section).queryByText("Latest updates")).not.toBeInTheDocument();
    expect(within(section).queryByText("Linked title")).not.toBeInTheDocument();
    expect(within(section).queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
    expect(within(section).queryByRole("link")).not.toBeInTheDocument();
    expect(within(section).getByText("The update body.")).toBeInTheDocument();
  });

  it("uses the title as plain body copy when an update has no description", () => {
    render(<NewsSection items={[{ date: "2026-04-12", title: "Fallback update" }]} />);

    expect(screen.getByText("Fallback update")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("makes an overflowing mobile news list keyboard-scrollable", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: false,
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
      clientHeight: { configurable: true, value: 160 },
      scrollHeight: { configurable: true, value: 320 },
    });
    fireEvent(window, new Event("resize"));

    await waitFor(() =>
      expect(screen.getByRole("region", { name: "News updates" })).toHaveAttribute(
        "tabindex",
        "0",
      ),
    );
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
