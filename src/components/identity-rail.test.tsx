import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import { researchInterests } from "@/data/research";
import type { Profile } from "@/data/types";
import { IdentityRail } from "./identity-rail";

describe("IdentityRail", () => {
  const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH;

  afterEach(() => {
    process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath;
  });

  it("prefixes identity media for a project Pages deployment", async () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/portfolio";
    const user = userEvent.setup();

    render(<IdentityRail profile={profile} />);

    const portrait = screen.getByRole("img", { name: "Portrait of Ruizhe Zhou" });
    expect(portrait).toHaveClass("identity-portrait__image");
    expect(portrait).toHaveAttribute(
      "src",
      expect.stringContaining("/portfolio/image/my-photo.jpg"),
    );
    expect(portrait.closest(".identity-portrait-frame")).not.toBeNull();

    await user.click(screen.getByRole("button", { name: /WeChat/i }));

    expect(
      screen.getByRole("img", { name: "WeChat QR code for Ruizhe Zhou" }),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("/portfolio/image/wechat.jpg"),
    );
  });

  it("filters contacts with unsafe URL schemes", () => {
    render(
      <IdentityRail
        profile={{
          ...profile,
          contacts: [{ label: "Unsafe", href: "javascript:alert(1)" }],
        }}
      />,
    );

    expect(screen.queryByRole("link", { name: "Unsafe" })).not.toBeInTheDocument();
  });

  it("shows the configured academic identity and filters empty contacts", () => {
    const { container } = render(<IdentityRail profile={profile} />);

    expect(screen.getByRole("heading", { level: 1, name: "Ruizhe Zhou" })).toHaveClass(
      "identity-rail__name",
    );
    if (profile.role) {
      expect(screen.getByText(profile.role)).toBeInTheDocument();
    } else {
      expect(container.querySelector(".identity-rail__role")).not.toBeInTheDocument();
    }
    if (profile.institution) {
      expect(screen.getByText(profile.institution)).toBeInTheDocument();
    } else {
      expect(container.querySelector(".identity-rail__institution")).toBeEmptyDOMElement();
    }
    expect(screen.getByRole("link", { name: /GitHub/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Google Scholar/i }),
    ).toBeInTheDocument();
    for (const label of ["GitHub", "Google Scholar", "LinkedIn", "Email"]) {
      const link = screen.getByRole("link", { name: new RegExp(label, "i") });
      const icons = link.querySelectorAll("svg[aria-hidden='true']");
      expect(icons.length).toBeGreaterThanOrEqual(1);
      expect(within(link).getByText(label)).toBeVisible();
    }
    expect(screen.getByRole("button", { name: /WeChat/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /WeChat/i })).toHaveLength(1);
    expect(screen.getByLabelText("X profile address not yet provided")).toHaveTextContent("X");
    expect(screen.queryByRole("link", { name: /^X/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:z1459306087@gmail.com",
    );
  });

  it("shows exactly the concise research interests in a secondary rail panel", () => {
    const { container } = render(<IdentityRail profile={profile} />);

    const panel = screen.getByRole("region", { name: "Research Interests" });
    expect(panel).toHaveClass("identity-interests");
    expect(within(panel).getByText("Research Interests")).toHaveAttribute(
      "id",
      "identity-interests-heading",
    );
    expect(within(panel).getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Physical Intelligence",
      "Visual Intelligence",
      "Multimodal",
    ]);
    expect(container.querySelectorAll(".identity-interests")).toHaveLength(1);
  });

  it("keeps the configured descriptions aligned with the concise interest labels", () => {
    expect(researchInterests).toEqual([
      {
        title: "Physical Intelligence",
        description: "Intelligent systems that perceive, reason, and act in the physical world.",
      },
      {
        title: "Visual Intelligence",
        description: "Understanding, grounding, and reasoning over visual content.",
      },
      {
        title: "Multimodal",
        description: "Integrating text, vision, and other modalities.",
      },
    ]);
  });

  it("omits the research interests panel when configured with no interests", () => {
    render(<IdentityRail profile={profile} interests={[]} />);

    expect(screen.queryByRole("region", { name: "Research Interests" })).not.toBeInTheDocument();
  });

  it("renders one QR-driven WeChat trigger even when its contact href is empty", () => {
    render(
      <IdentityRail
        profile={{
          ...profile,
          wechatQr: "/profile/wechat.png",
          contacts: [
            ...profile.contacts.filter((contact) => contact.label !== "WeChat"),
            { label: "WeChat", href: "" },
            { label: "WeChat", href: "https://example.com/duplicate" },
          ],
        }}
      />,
    );

    expect(screen.getAllByRole("button", { name: /WeChat/i })).toHaveLength(1);
    expect(screen.queryByRole("link", { name: /WeChat/i })).not.toBeInTheDocument();
  });

  it("shows all configured optional contacts", () => {
    const configuredProfile: Profile = {
      ...profile,
      wechatQr: "/profile/wechat.png",
      contacts: profile.contacts.map((contact) => ({
        ...contact,
        href:
          contact.href ||
          {
            LinkedIn: "https://linkedin.com/in/ritz",
            Email: "mailto:ritz@example.com",
          }[contact.label],
      })),
    };

    render(<IdentityRail profile={configuredProfile} />);

    expect(screen.getByRole("link", { name: /LinkedIn/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /WeChat/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Email/i })).toBeInTheDocument();
    for (const label of ["LinkedIn", "WeChat", "Email"]) {
      const row = screen.getByRole(label === "WeChat" ? "button" : "link", {
        name: new RegExp(label, "i"),
      });
      expect(row.querySelector("svg[aria-hidden='true']")).toBeInTheDocument();
      expect(within(row).getByText(label)).toBeVisible();
    }
  });

  it("renders accessible artwork when no portrait is configured", () => {
    render(<IdentityRail profile={{ ...profile, portrait: "" }} />);

    expect(screen.getByText("Portrait not yet provided")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("replaces a failed configured portrait with accessible fallback artwork", () => {
    render(<IdentityRail profile={{ ...profile, portrait: "/profile/portrait.jpg" }} />);

    fireEvent.error(screen.getByRole("img", { name: "Portrait of Ruizhe Zhou" }));

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("Portrait not yet provided")).toBeInTheDocument();
  });
});
