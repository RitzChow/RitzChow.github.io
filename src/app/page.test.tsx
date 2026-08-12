import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("home page", () => {
  it("presents Ruizhe Zhou as the main heading", () => {
    render(<Page />);

    expect(screen.getByRole("main")).toHaveTextContent("Ruizhe Zhou");
  });
});
