import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("global layout styles", () => {
  it("keeps the site header pinned to an opaque paper surface", () => {
    const headerRule = css.match(/\.site-header\s*{([^}]*)}/)?.[1] ?? "";

    expect(headerRule).toMatch(/position:\s*sticky/);
    expect(headerRule).toMatch(/top:\s*0/);
    expect(headerRule).toMatch(/z-index:\s*\d+/);
    expect(headerRule).toMatch(/background(?:-color)?:\s*(?:var\(--paper\)|rgb\()/);
    expect(headerRule).toMatch(/border-bottom:/);
  });

  it("reserves sticky-header clearance for home anchors", () => {
    const sectionRule = css.match(/\.home-section\s*{([^}]*)}/)?.[1] ?? "";

    expect(sectionRule).toMatch(/scroll-margin-top:\s*(?:calc\(|clamp\(|[5-9](?:\.\d+)?rem)/);
  });

  it("uses a square, lightly offset editorial frame for the portrait", () => {
    const portraitRule = css.match(/\.identity-portrait\s*{([^}]*)}/)?.[1] ?? "";
    const imageRule = css.match(/\.identity-portrait__image\s*{([^}]*)}/)?.[1] ?? "";

    expect(portraitRule).toMatch(/aspect-ratio:\s*1(?:\s*\/\s*1)?/);
    expect(portraitRule).not.toMatch(/border-radius|box-shadow/);
    expect(imageRule).toMatch(/object-fit:\s*cover/);
    expect(css).toMatch(/\.identity-portrait-frame::(?:before|after)/);
    expect(css).toMatch(/transform:\s*translate\(/);
  });

  it("aligns the desktop rail and About section with shared grid padding", () => {
    const gridRule = css.match(/\.home-grid\s*{([^}]*)}/)?.[1] ?? "";
    const contentRule = css.match(/\.home-content\s*{([^}]*)}/)?.[1] ?? "";
    const railRule = css.match(/\.identity-rail\s*{([^}]*)}/)?.[1] ?? "";
    const mobileRule = css.match(/@media \(max-width:\s*760px\)[\s\S]*?\.home-grid\s*{([^}]*)}/)?.[1] ?? "";

    expect(gridRule).toMatch(/padding-top:\s*clamp\(/);
    expect(contentRule).not.toMatch(/padding-top:/);
    expect(railRule).not.toMatch(/padding-top:/);
    expect(contentRule).toMatch(/grid-column:\s*1/);
    expect(contentRule).toMatch(/grid-row:\s*1/);
    expect(railRule).toMatch(/grid-column:\s*2/);
    expect(railRule).toMatch(/grid-row:\s*1/);
    expect(mobileRule).toMatch(/padding-top:\s*0/);
  });

  it("styles research interests as a quiet rounded rail panel", () => {
    const panelRule = css.match(/\.identity-interests\s*{([^}]*)}/)?.[1] ?? "";

    expect(panelRule).toMatch(/border:\s*1px solid/);
    expect(panelRule).toMatch(/border-radius:/);
    expect(panelRule).not.toMatch(/box-shadow/);
    const mobilePanelRule = css.match(
      /@media \(max-width:\s*760px\)[\s\S]*?\.identity-interests\s*{([^}]*)}/,
    )?.[1] ?? "";
    expect(mobilePanelRule).toMatch(/grid-column:\s*1\s*\/\s*-1/);
  });

  it("uses equal education and experience columns that stack on mobile", () => {
    const gridRule = css.match(/\.education-experience-grid\s*{([^}]*)}/)?.[1] ?? "";
    const mobileGridRule = css.match(
      /@media \(max-width:\s*760px\)[\s\S]*?\.education-experience-grid\s*{([^}]*)}/,
    )?.[1] ?? "";

    expect(gridRule).toMatch(/display:\s*grid/);
    expect(gridRule).toMatch(/grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    expect(mobileGridRule).toMatch(/grid-template-columns:\s*minmax\(0,\s*1fr\)|grid-template-columns:\s*1fr/);
  });

  it("keeps institution rows editorial and logos fully contained", () => {
    const rowRule = css.match(/\.institution-row\s*{([^}]*)}/)?.[1] ?? "";
    const markerRule = css.match(/\.institution-row::before\s*{([^}]*)}/)?.[1] ?? "";
    const logoRule = css.match(/\.institution-row__logo\s*{([^}]*)}/)?.[1] ?? "";

    expect(rowRule).toMatch(/border-top:\s*1px solid/);
    expect(rowRule).not.toMatch(/box-shadow/);
    expect(markerRule).toMatch(/background(?:-color)?:\s*var\(--clay\)/);
    expect(logoRule).toMatch(/object-fit:\s*contain/);
    expect(logoRule).toMatch(/object-position:\s*left center/);
    expect(logoRule).not.toMatch(/object-fit:\s*cover/);
  });

  it("centers the publication filter and uses a sliding light indicator", () => {
    const filterRule = css.match(/\.publication-filter\s*{([^}]*)}/)?.[1] ?? "";
    const indicatorRule = css.match(/\.publication-filter::before\s*{([^}]*)}/)?.[1] ?? "";

    expect(filterRule).toMatch(/margin-inline:\s*auto/);
    expect(filterRule).toMatch(/border-radius:/);
    expect(indicatorRule).toMatch(/transition:\s*transform/);
    expect(css).toMatch(/\.publication-filter\[data-selected="all"\]::before/);
    expect(css).toMatch(/\.publication-filter\[data-selected="visual"\]::before/);
  });

  it("keeps the publication author legend readable but visually supporting", () => {
    const legendRule = css.match(/\.publication-author-legend\s*{([^}]*)}/)?.[1] ?? "";

    expect(legendRule).toMatch(/font-size:\s*0\.88rem/);
    expect(legendRule).toMatch(/font-weight:\s*(?:500|600)/);
    expect(legendRule).toMatch(/color:\s*(?:var\(--ink\)|color-mix\([^;]*var\(--ink\))/);
    expect(legendRule).toMatch(/text-align:\s*center/);
    expect(legendRule).toMatch(/margin:/);
  });

  it("uses one white 16:9 canvas and contains publication media without cropping", () => {
    const canvasRule = css.match(/\.paper-figure--uniform\s*{([^}]*)}/)?.[1] ?? "";
    const imageRule = css.match(/\.paper-figure img\s*{([^}]*)}/)?.[1] ?? "";

    expect(canvasRule).toMatch(/aspect-ratio:\s*16\s*\/\s*9/);
    expect(canvasRule).toMatch(/background(?:-color)?:\s*(?:#fff(?:fff)?|white|rgb\(255\s+255\s+255\))/);
    expect(imageRule).toMatch(/width:\s*100%/);
    expect(imageRule).toMatch(/height:\s*100%/);
    expect(imageRule).toMatch(/object-fit:\s*contain/);
    expect(imageRule).toMatch(/object-position:\s*center/);
    expect(css).not.toMatch(/\.paper-figure--pdf\s+object/);
  });

  it("stacks publication media above details on mobile", () => {
    const mobileRule = css.match(
      /@media \(max-width:\s*700px\)[\s\S]*?\.publication-row\s*{([^}]*)}/,
    )?.[1] ?? "";

    expect(mobileRule).toMatch(/grid-template-columns:\s*1fr/);
  });

  it("bounds the news feed to one item and contains vertical scrolling", () => {
    const feedRule = css.match(/\.news-feed\s*{([^}]*)}/)?.[1] ?? "";
    const itemRule = css.match(/\.news-item\s*{([^}]*)}/)?.[1] ?? "";
    const mobileFeedRule = css.match(
      /@media \(max-width:\s*760px\)[\s\S]*?\.news-feed\s*{([^}]*)}/,
    )?.[1] ?? "";

    expect(feedRule).toMatch(/--news-viewport-height:/);
    expect(feedRule).toMatch(/block-size:\s*var\(--news-viewport-height\)/);
    expect(feedRule).toMatch(/overflow-y:\s*auto/);
    expect(feedRule).toMatch(/overscroll-behavior-y:\s*contain/);
    expect(feedRule).toMatch(/touch-action:\s*pan-y/);
    expect(itemRule).not.toMatch(/(?:min-)?height:/);
    expect(mobileFeedRule).not.toMatch(/height:\s*auto|max-height:\s*none|overflow:\s*visible/);
  });
});
