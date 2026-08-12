import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";

describe("home page", () => {
  it("presents Ruizhe Zhou as the main heading", () => {
    render(<Page />);

    expect(screen.getByRole("main")).toHaveTextContent("Ruizhe Zhou");
  });
});
