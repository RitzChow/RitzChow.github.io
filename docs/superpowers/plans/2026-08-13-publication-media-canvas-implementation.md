# Publication Media Canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Present every publication visual inside the same responsive 16:9 white canvas while making the single author-notation legend easier to read.

**Architecture:** Keep publication metadata and filter behavior unchanged. Make `PaperFigure` own one consistent media geometry for both PDF and fallback variants, with CSS responsible for fitting the embedded vector PDF into the fixed canvas without cropping. Keep the author legend at archive level and adjust only its visual hierarchy.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Vitest/Testing Library, Playwright

---

### Task 1: Lock publication media to one canvas

**Files:**
- Modify: `src/components/paper-figure.tsx`
- Modify: `src/components/publication-list.tsx`
- Modify: `src/components/publication-list.test.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/globals.test.ts`

- [ ] **Step 1: Write failing component and CSS tests**

Update the publication-list test to assert that PDF and fallback figures share the same class and do not receive source-specific inline aspect ratios:

```tsx
expect(container.querySelector(".paper-figure--pdf")).toHaveClass("paper-figure--uniform");
expect(container.querySelector(".paper-figure--pdf")).not.toHaveAttribute("style");
expect(container.querySelector(".paper-figure--fallback")).toHaveClass("paper-figure--uniform");
```

Update the global CSS test to require the shared canvas and complete-fit rules:

```ts
expect(uniformRule).toMatch(/aspect-ratio:\s*16\s*\/\s*9/);
expect(uniformRule).toMatch(/background:\s*(?:#fff|white|rgb\(255\s+255\s+255)/);
expect(pdfObjectRule).toMatch(/object-fit:\s*contain/);
```

- [ ] **Step 2: Run focused tests and confirm failure**

Run:

```bash
npm test -- --run src/components/publication-list.test.tsx src/app/globals.test.ts
```

Expected: FAIL because figures still use per-publication aspect ratios and no shared uniform class exists.

- [ ] **Step 3: Implement the uniform media contract**

In `paper-figure.tsx`, apply `paper-figure--uniform` to both PDF and fallback figures and remove the inline aspect-ratio style. Retain `sitePath(pdfMedia)`, the direct `application/pdf` object, and the accessible `Open vector PDF` fallback link.

In `publication-list.tsx`, stop passing `mediaAspectRatio` to `PaperFigure`; leave the metadata field intact to avoid an unrelated data migration.

In `globals.css`, define one presentation:

```css
.paper-figure--uniform {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border: 1px solid var(--rule);
  background: #fff;
}

.paper-figure--pdf object {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: #fff;
  object-fit: contain;
}
```

Keep fallback artwork centered inside the same canvas and avoid shadows, gradients, or decorative mounting surfaces.

- [ ] **Step 4: Run focused tests and confirm success**

Run:

```bash
npm test -- --run src/components/publication-list.test.tsx src/app/globals.test.ts
```

Expected: all focused tests pass.

### Task 2: Strengthen the global author legend and verify responsively

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/publication-filter.test.tsx`
- Modify: `e2e/portfolio.spec.ts`

- [ ] **Step 1: Add failing legend hierarchy assertions**

Require one archive-level legend and no article-level copies, then assert its CSS uses readable supporting-text scale and stronger contrast:

```ts
expect(screen.getAllByText("* Equal contribution · † Corresponding author")).toHaveLength(1);
expect(legendRule).toMatch(/font-size:\s*(?:0\.8[5-9]|0\.9)rem/);
expect(legendRule).toMatch(/font-weight:\s*(?:5|6)00/);
```

- [ ] **Step 2: Run focused tests and confirm failure**

Run:

```bash
npm test -- --run src/components/publication-filter.test.tsx src/app/globals.test.ts
```

Expected: FAIL because the current legend is 0.72rem and low contrast.

- [ ] **Step 3: Implement the legend treatment**

Update `.publication-author-legend` to approximately `0.88rem`, medium weight, and the main ink color at reduced opacity. Preserve centered alignment and one-instance archive placement.

- [ ] **Step 4: Expand browser coverage**

In `e2e/portfolio.spec.ts`, assert:

```ts
await expect(page.locator(".paper-figure--uniform")).toHaveCount(4);
await expect(page.locator("article .publication-author-legend")).toHaveCount(0);
await expect(page.locator(".publication-author-legend")).toHaveCount(1);
```

Run:

```bash
npm test -- --run
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
git diff --check
```

Expected: unit tests, lint, TypeScript, production build, and all Playwright tests pass; no whitespace errors are reported.

- [ ] **Step 5: Commit the implementation**

```bash
git add src/components/paper-figure.tsx src/components/publication-list.tsx src/components/publication-list.test.tsx src/components/publication-filter.test.tsx src/app/globals.css src/app/globals.test.ts e2e/portfolio.spec.ts
git commit -m "refine publication media presentation"
```
