import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";

describe("home page", () => {
  it("presents the academic statement as the main heading", () => {
    render(<Page />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Understanding intelligence through the physical world.",
      }),
    ).toBeInTheDocument();
  });
});
