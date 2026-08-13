# Academic Portfolio Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing portfolio with supplied media, a compact sticky header, reordered home content, confirmed contact interactions, four current publications, direct vector PDF previews, author-role marks, and accessible publication filters.

**Architecture:** Preserve the current static Next.js App Router structure and data/presentation separation. Extend typed publication data for contribution marks, filter groups, Scholar links, and PDF media; keep interactive filtering and PDF fallbacks in focused client components. Serve user assets from `public/image/` through the existing base-path helper.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind-backed global CSS, React Icons, Vitest, Testing Library, Playwright, static GitHub Pages export.

---

### Task 1: Normalize and Serve Supplied Assets

**Files:**
- Create: `public/image/my-photo.jpg`
- Create: `public/image/wechat.jpg`
- Create: `public/image/physical-ai-survey.pdf`
- Create: `public/image/when-prompts-become-pixels.pdf`
- Create: `public/image/models-under-scope.pdf`
- Modify: `src/data/profile.ts`
- Modify: `src/lib/site-path.test.ts`
- Test: `src/components/identity-rail.test.tsx`

- [ ] Copy the five supplied files from root `image/` into `public/image/` with normalized filenames; do not rasterize or modify the PDFs.
- [ ] Write failing tests that expect the portrait and WeChat paths and normalize a raw email address to a `mailto:` contact.
- [ ] Implement profile media paths and contact normalization without overwriting the user's configured email or LinkedIn URL.
- [ ] Verify focused tests fail before implementation and pass after it.
- [ ] Run `npm test -- --run`, `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
- [ ] Commit only task files with `feat: connect supplied portfolio media`.

### Task 2: Tighten the Sticky Header and Reorder Home Content

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/page.tsx`
- Modify: `src/app/page.test.tsx`
- Modify: `src/components/home-sections.test.tsx`
- Modify: `e2e/portfolio.spec.ts`

- [ ] Write failing tests for About → News → Research → Experience source order and sticky header behavior.
- [ ] Reorder the home sections while retaining semantic anchor IDs.
- [ ] Reduce header height, inner maximum width, navigation gaps, and About top spacing.
- [ ] Make the header sticky with a readable paper surface, thin rule, and correct anchor scroll offset.
- [ ] Preserve the existing mobile menu and reduced-motion behavior.
- [ ] Verify desktop News uses its fixed-width column and actual-overflow internal scrolling while mobile expands.
- [ ] Run focused tests, full unit tests, Playwright, lint, TypeScript, and build.
- [ ] Commit with `feat: refine home rhythm and sticky navigation`.

### Task 3: Refine the Identity Rail and Contact Actions

**Files:**
- Modify: `src/components/identity-rail.tsx`
- Modify: `src/components/identity-rail.test.tsx`
- Modify: `src/components/wechat-dialog.tsx`
- Modify: `src/components/wechat-dialog.test.tsx`
- Modify: `src/app/globals.css`

- [ ] Write failing tests for the square portrait, all five configured contact labels, `mailto:` email, and QR-only WeChat trigger.
- [ ] Render the supplied square portrait with an error fallback.
- [ ] Add a double-rule, slightly imperfect editorial frame using CSS without shadows or rounded cards.
- [ ] Ensure Email opens the configured recipient and WeChat opens the supplied QR code.
- [ ] Re-run native and fallback modal tests for Escape, focus containment/restoration, and pointer blocking.
- [ ] Verify responsive rail ordering and no horizontal overflow.
- [ ] Commit with `feat: refine profile rail and contacts`.

### Task 4: Replace Publication Data and Add Contribution Marks

**Files:**
- Modify: `src/data/types.ts`
- Modify: `src/data/publications.ts`
- Modify: `src/components/publication-list.tsx`
- Modify: `src/components/publication-list.test.tsx`
- Modify: `src/components/publication-actions.tsx`

- [ ] Write failing tests expecting exactly four papers and no LLM-Detector entry.
- [ ] Extend publication authors to structured objects with optional `equalContribution` and `correspondingAuthor` booleans.
- [ ] Add optional `scholar`, `pdfMedia`, and `filterGroups` fields while retaining publication type and fallback category.
- [ ] Populate authoritative metadata for the Survey, Visual Prompt Grounding, SCOPE, and Position papers.
- [ ] Mark only the confirmed Survey and Position authors and render the legend only for marked papers.
- [ ] Preserve Ruizhe Zhou emphasis independently from contribution symbols.
- [ ] Add Google Scholar links supplied by the user and authoritative paper/project links.
- [ ] Run focused and complete verification.
- [ ] Commit with `feat: update publication archive metadata`.

### Task 5: Embed Vector PDFs and Add Publication Filtering

**Files:**
- Create: `src/components/publication-filter.tsx`
- Create: `src/components/publication-filter.test.tsx`
- Modify: `src/components/publication-list.tsx`
- Modify: `src/components/paper-figure.tsx`
- Modify: `src/components/publication-list.test.tsx`
- Modify: `src/app/publications/page.tsx`
- Modify: `src/app/globals.css`

- [ ] Write failing tests for All/Physical/Visual selection, keyboard behavior, selected-state semantics, order preservation, and SCOPE appearing only under All.
- [ ] Implement the compact segmented control below the Publications heading.
- [ ] Keep All selected by default; filter without navigation or layout-code duplication.
- [ ] Embed the three supplied PDFs directly with `<object type="application/pdf">` and a visible fallback link.
- [ ] Keep the Position Paper deterministic fallback figure.
- [ ] Preserve PDF aspect ratios and avoid raster conversion, cropping, or screenshots.
- [ ] Stack media above publication information on mobile and respect reduced motion.
- [ ] Run focused tests, full tests, Playwright, lint, TypeScript, and both normal/project-path builds.
- [ ] Commit with `feat: add vector publication previews and filters`.

### Task 6: Final Browser Acceptance and Documentation

**Files:**
- Modify: `e2e/portfolio.spec.ts`
- Modify: `README.md`

- [ ] Add browser assertions for sticky header persistence, compact header spacing, home section order, square portrait, email `mailto:`, and WeChat dialog.
- [ ] Add browser assertions for direct PDF objects, their fallback links, filter mouse/keyboard behavior, category results, author legends, and mobile layout.
- [ ] Confirm the static artifact serves PDFs with base-path-safe URLs.
- [ ] Update README media and publication-maintenance documentation.
- [ ] Run `npm test -- --run`, `npm run test:e2e`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, a simulated project Pages build, `npm audit --audit-level=high`, and `git diff --check`.
- [ ] Confirm root `image/` source files are either intentionally retained as user inputs or removed only with explicit approval; do not silently delete them.
- [ ] Commit with `test: verify portfolio refinements`.
