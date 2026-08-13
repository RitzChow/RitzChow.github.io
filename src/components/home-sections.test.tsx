import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { NewsItem } from "@/data/types";
import { AboutSection } from "./about-section";
import { EducationSection } from "./education-section";
import { ExperienceSection } from "./experience-section";
import { NewsSection } from "./news-section";

describe("home sections", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("exposes semantic section landmarks with stable IDs", () => {
    const { container } = render(
      <>
        <AboutSection />
        <EducationSection />
        <ExperienceSection />
        <NewsSection />
      </>,
    );

    for (const id of ["about", "education", "experience", "news"]) {
      expect(container.querySelector(`section#${id}`)).toBeInTheDocument();
    }
    expect(container.querySelector("section#research")).not.toBeInTheDocument();
  });

  it("renders the three confirmed About paragraphs and linked mentors", () => {
    render(<AboutSection />);

    const section = screen.getByRole("region", { name: "About" });
    expect(section.querySelectorAll(".about__bio > p")).toHaveLength(3);
    expect(section).toHaveTextContent("I am an undergraduate student at Sun Yat-sen University");
    expect(section).toHaveTextContent("My research interests primarily lie in physical intelligence");
    expect(section).toHaveTextContent("I am currently seeking PhD/MS opportunities for Fall 2027.");
    expect(within(section).getByRole("link", { name: "Prof. Xiaodan Liang" })).toHaveAttribute("href", "https://scholar.google.com/citations?user=voxznZAAAAAJ&hl=zh-CN");
    expect(within(section).getByRole("link", { name: "Prof. Pengtao Xie" })).toHaveAttribute("href", "https://scholar.google.com/citations?user=cnncomYAAAAJ&hl=zh-CN");
    expect(within(section).getByRole("link", { name: "Prof. Xiaoming Liu" })).toHaveAttribute("href", "https://scholar.google.com/citations?hl=zh-CN&user=Bii0w1oAAAAJ");
    expect(within(section).getByText("PhD/MS opportunities").closest(".rough-phrase")).not.toBeNull();
    expect(within(section).getByRole("heading", { level: 2, name: "About" })).toHaveClass(
      "section-label",
    );
    expect(within(section).queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  it("renders the confirmed education with its logo and exact date", () => {
    render(<EducationSection />);

    const section = screen.getByRole("region", { name: "Education" });
    expect(within(section).getAllByRole("listitem")).toHaveLength(1);
    expect(section).toHaveTextContent("Undergraduate");
    expect(section).toHaveTextContent("Sun Yat-sen University");
    expect(section).toHaveTextContent("2023.09 – 2027.06");
    expect(section).toHaveTextContent("Supervisor: Xiaodan Liang");
    expect(within(section).getByRole("img", { name: "Sun Yat-sen University logo" })).toHaveAttribute(
      "src",
      "/image/sysu-logo.svg",
    );
  });

  it("renders the two confirmed research assistant experiences in order", () => {
    render(<ExperienceSection />);

    const section = screen.getByRole("region", { name: "Experience" });
    const rows = within(section).getAllByRole("listitem");
    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.textContent)).toEqual([
      expect.stringContaining("UNC Chapel HillResearch Assistant2026.05 -"),
      expect.stringContaining("UC San DiegoResearch Assistant2025.11 - 2026.02"),
    ]);
    expect(within(rows[0]).getByRole("img", { name: "UNC Chapel Hill logo" })).toHaveAttribute(
      "src",
      "/image/unc-logo.svg",
    );
    expect(within(rows[1]).getByRole("img", { name: "UC San Diego logo" })).toHaveAttribute(
      "src",
      "/image/uc-san-diego-logo.svg",
    );
  });

  it("labels configured lab, advisor, and project experience details", () => {
    render(
      <ExperienceSection
        items={[{
          role: "Research Assistant",
          institution: "Test University",
          logo: "/image/test.svg",
          logoAlt: "Test University logo",
          lab: "Embodied Intelligence Lab",
          advisor: "Prof. Ada Example",
          project: "World Model Evaluation",
        }]}
      />,
    );

    const section = screen.getByRole("region", { name: "Experience" });
    expect(within(section).getByText("Lab")).toBeInTheDocument();
    expect(within(section).getByText("Embodied Intelligence Lab")).toBeInTheDocument();
    expect(within(section).getByText("Advisor")).toBeInTheDocument();
    expect(within(section).getByText("Prof. Ada Example")).toBeInTheDocument();
    expect(within(section).getByText("Project")).toBeInTheDocument();
    expect(within(section).getByText("World Model Evaluation")).toBeInTheDocument();
  });

  it("links a configured supervisor homepage below the date", () => {
    render(
      <ExperienceSection
        items={[{
          role: "Research Assistant",
          institution: "Test University",
          displayDate: "2026.01 -",
          supervisor: "Prof. Ada Example",
          supervisorUrl: "https://example.com/ada",
          logo: "/image/test.svg",
          logoAlt: "Test University logo",
        }]}
      />,
    );

    const link = screen.getByRole("link", { name: "Supervisor: Prof. Ada Example" });
    expect(link).toHaveAttribute("href", "https://example.com/ada");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("omits labels for unconfigured experience details", () => {
    render(<ExperienceSection items={[{
      role: "Researcher",
      institution: "Test University",
      logo: "/image/test.svg",
      logoAlt: "Test University logo",
    }]} />);

    const section = screen.getByRole("region", { name: "Experience" });
    expect(within(section).queryByText("Lab")).not.toBeInTheDocument();
    expect(within(section).queryByText("Advisor")).not.toBeInTheDocument();
    expect(within(section).queryByText("Project")).not.toBeInTheDocument();
    expect(within(section).queryByRole("definition")).not.toBeInTheDocument();
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

  it("measures one complete news item and refreshes overflow when content resizes", async () => {
    let resizeCallback: ResizeObserverCallback | undefined;
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: ResizeObserverCallback) {
          resizeCallback = callback;
        }

        observe = observe;
        disconnect = disconnect;
      },
    );
    const items = Array.from({ length: 2 }, (_, index) => ({
      date: `2026-04-${String(index + 1).padStart(2, "0")}`,
      title: `Update ${index + 1}`,
    }));

    render(<NewsSection items={items} />);

    const list = screen.getByRole("list");
    const feed = list.parentElement as HTMLDivElement;
    const firstItem = within(list).getAllByRole("listitem")[0];
    expect(observe).toHaveBeenCalledWith(feed);
    expect(observe).toHaveBeenCalledWith(list);
    expect(observe).toHaveBeenCalledWith(firstItem);

    Object.defineProperties(feed, {
      clientHeight: { configurable: true, value: 184 },
      scrollHeight: { configurable: true, value: 368 },
    });
    const itemRect = vi.spyOn(firstItem, "getBoundingClientRect").mockReturnValue({
      bottom: 184,
      height: 184,
      left: 0,
      right: 600,
      top: 0,
      width: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    act(() => resizeCallback?.([], {} as ResizeObserver));

    await waitFor(() => {
      expect(feed).toHaveStyle({ blockSize: "184px" });
      expect(screen.getByRole("region", { name: "News updates" })).toHaveAttribute(
        "tabindex",
        "0",
      );
    });

    Object.defineProperties(feed, {
      clientHeight: { configurable: true, value: 220 },
      scrollHeight: { configurable: true, value: 220 },
    });
    itemRect.mockReturnValue({
      bottom: 220,
      height: 220,
      left: 0,
      right: 600,
      top: 0,
      width: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    act(() => resizeCallback?.([], {} as ResizeObserver));

    await waitFor(() => {
      expect(feed).toHaveStyle({ blockSize: "220px" });
      expect(feed).not.toHaveAttribute("role");
      expect(feed).not.toHaveAttribute("tabindex");
    });
  });

  it("does not make a non-overflowing news list a focus stop", async () => {
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

  it("makes a long news list keyboard-scrollable", async () => {
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
