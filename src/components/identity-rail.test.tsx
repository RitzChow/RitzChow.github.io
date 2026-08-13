import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import type { Profile } from "@/data/types";
import { IdentityRail } from "./identity-rail";

describe("IdentityRail", () => {
  it("shows the configured academic identity and filters empty contacts", () => {
    render(<IdentityRail profile={profile} />);

    expect(screen.getByText("Ruizhe Zhou")).toBeInTheDocument();
    expect(screen.getByText("Undergraduate Researcher")).toBeInTheDocument();
    expect(screen.getByText("Sun Yat-sen University")).toBeInTheDocument();
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
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:z1459306087@gmail.com",
    );
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
