import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RootLayout, { metadata } from "./layout";

describe("root layout", () => {
  it("describes Ruizhe Zhou's research areas in metadata", () => {
    expect(metadata.description).toContain("Ruizhe Zhou");
    expect(metadata.description).toMatch(/physical AI/i);
    expect(metadata.description).toMatch(/physics reasoning/i);
    expect(metadata.description).toMatch(/multimodal evaluation/i);
  });

  it("opts the document into smooth native anchor scrolling", () => {
    const markup = renderToStaticMarkup(<RootLayout><main>Content</main></RootLayout>);
    expect(markup).toContain('<html lang="en" data-scroll-behavior="smooth">');
  });
});
