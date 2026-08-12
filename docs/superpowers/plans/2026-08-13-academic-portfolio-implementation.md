# Academic Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Ruizhe Zhou's responsive English academic portfolio with a data-driven home page, publication archive, accessible interactions, and GitHub Pages deployment.

**Architecture:** Use a statically exported Next.js App Router project. Server components render structured academic data; small client components handle the mobile menu, BibTeX disclosure/copy, and WeChat dialog. Presentation is split into focused section components and Tailwind-backed global design tokens.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Rough.js, React Icons, Vitest, Testing Library, Playwright, GitHub Actions.

---

## File Map

- `src/app/layout.tsx`: global metadata, fonts, header, and page shell.
- `src/app/page.tsx`: home-page composition.
- `src/app/publications/page.tsx`: publication archive route.
- `src/app/globals.css`: design tokens, typography, accessibility, paper texture, and restrained motion.
- `src/components/site-header.tsx`: desktop and mobile navigation.
- `src/components/identity-rail.tsx`: portrait, identity, and contact list.
- `src/components/wechat-dialog.tsx`: accessible QR-code dialog.
- `src/components/about-section.tsx`: home introduction.
- `src/components/research-section.tsx`: numbered research interests.
- `src/components/experience-section.tsx`: experience timeline.
- `src/components/news-section.tsx`: desktop scrolling and mobile flowing news list.
- `src/components/publication-list.tsx`: ordered publication rows.
- `src/components/publication-actions.tsx`: publication links and BibTeX disclosure/copy.
- `src/components/paper-figure.tsx`: image or deterministic abstract fallback.
- `src/components/rough-mark.tsx`: deterministic decorative mark.
- `src/data/types.ts`: academic content interfaces.
- `src/data/profile.ts`: profile, CV, contact, and portrait values.
- `src/data/research.ts`: research interests.
- `src/data/experience.ts`: experience entries.
- `src/data/news.ts`: news entries.
- `src/data/publications.ts`: publication metadata.
- `src/lib/content.ts`: ordering and visibility helpers.
- `src/lib/site-path.ts`: repository-aware static asset paths.
- `public/papers/`: supplied publication figures.
- `public/profile/`: supplied portrait and WeChat QR code.
- `public/cv.pdf`: supplied CV.
- `src/test/setup.ts`: DOM test setup.
- `src/**/*.test.tsx`: component tests beside components.
- `e2e/portfolio.spec.ts`: browser-level responsive and accessibility flows.
- `next.config.ts`: static export and GitHub Pages base path.
- `.github/workflows/deploy-pages.yml`: build and Pages deployment.

### Task 1: Create the Static Next.js Foundation

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `tsconfig.json`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/test/setup.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Preserve the user's existing deletions and inspect the staged state**

Run: `git status --short`

Expected: the pre-existing deleted legacy files remain unstaged; only files from this plan are staged in later commits.

- [ ] **Step 2: Create the package manifest**

Create `package.json` with scripts `dev`, `build`, `lint`, `test`, `test:watch`, and `test:e2e`. Add Next.js, React, Rough.js, and React Icons as runtime dependencies. Add TypeScript, Tailwind CSS, PostCSS, ESLint, Vitest, jsdom, Testing Library, and Playwright as development dependencies.

- [ ] **Step 3: Configure static export**

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const isProjectPages = process.env.GITHUB_ACTIONS === "true";
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const basePath = isProjectPages && repository !== "RitzChow.github.io" ? `/${repository}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 4: Add the minimal app shell and test configuration**

Make `src/app/layout.tsx` export metadata for “Ruizhe Zhou — Academic Portfolio,” import `globals.css`, and render children. Make `src/app/page.tsx` render `<main>Ruizhe Zhou</main>`. Configure Vitest with jsdom and `src/test/setup.ts` importing `@testing-library/jest-dom/vitest`.

- [ ] **Step 5: Install dependencies and prove the scaffold builds**

Run: `npm install && npm run build && npm test -- --run`

Expected: Next.js creates `out/index.html`; Vitest exits successfully.

- [ ] **Step 6: Commit the foundation**

```bash
git add package.json package-lock.json next.config.ts postcss.config.mjs tsconfig.json eslint.config.mjs .gitignore src/app src/test vitest.config.ts
git commit -m "build: scaffold static academic portfolio"
```

### Task 2: Define Structured Academic Content

**Files:**
- Create: `src/data/types.ts`
- Create: `src/data/profile.ts`
- Create: `src/data/research.ts`
- Create: `src/data/experience.ts`
- Create: `src/data/news.ts`
- Create: `src/data/publications.ts`
- Create: `src/lib/content.ts`
- Test: `src/lib/content.test.ts`

- [ ] **Step 1: Write failing content-helper tests**

Test that `definedLinks` removes links whose `href` is empty, `sortNews` sorts ISO dates newest first, and `sortPublications` sorts year descending while preserving source order within one year.

```ts
expect(definedLinks([{ label: "GitHub", href: "https://github.com/RitzChow" }, { label: "Email", href: "" }]))
  .toHaveLength(1);
expect(sortNews([{ date: "2025-01-01" }, { date: "2026-01-01" }])[0].date)
  .toBe("2026-01-01");
expect(sortPublications([{ id: "a", year: 2024 }, { id: "b", year: 2025 }])[0].id)
  .toBe("b");
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --run src/lib/content.test.ts`

Expected: FAIL because the content helpers do not exist.

- [ ] **Step 3: Define the data contracts**

Define `Profile`, `ContactLink`, `ResearchInterest`, `Experience`, `NewsItem`, `Publication`, and `PublicationLinks` in `src/data/types.ts`. Optional values include `portrait`, `cv`, `wechatQr`, `image`, `tldr`, `award`, `bibtex`, and individual links.

- [ ] **Step 4: Implement typed content and helpers**

Use verified values only: name `Ruizhe Zhou`, role `Undergraduate Researcher`, institution `Sun Yat-sen University`, GitHub URL, Google Scholar URL, the three approved research interests, the verified SYSU experience, and the three verified publications from the design specification. Leave unknown contact values and supplied-media paths as empty strings so render helpers omit them.

Implement pure helpers:

```ts
export const definedLinks = <T extends { href?: string }>(links: T[]) =>
  links.filter((link): link is T & { href: string } => Boolean(link.href?.trim()));

export const sortNews = <T extends { date: string }>(items: T[]) =>
  [...items].sort((a, b) => b.date.localeCompare(a.date));

export const sortPublications = <T extends { year: number }>(items: T[]) =>
  items.map((item, index) => ({ item, index }))
    .sort((a, b) => b.item.year - a.item.year || a.index - b.index)
    .map(({ item }) => item);
```

- [ ] **Step 5: Run tests and type checking**

Run: `npm test -- --run src/lib/content.test.ts && npx tsc --noEmit`

Expected: PASS with no type errors.

- [ ] **Step 6: Commit the content layer**

```bash
git add src/data src/lib
git commit -m "feat: add structured academic content"
```

### Task 3: Build the Editorial Shell and Navigation

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/components/site-header.tsx`
- Create: `src/components/rough-mark.tsx`
- Test: `src/components/site-header.test.tsx`

- [ ] **Step 1: Write failing navigation tests**

Render `SiteHeader` and assert that About, Research, Publications, Experience, and News are present; assert CV is absent when `cv` is empty and present when a URL is supplied; open the mobile menu and verify `aria-expanded="true"`.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --run src/components/site-header.test.tsx`

Expected: FAIL because `SiteHeader` does not exist.

- [ ] **Step 3: Implement the visual system**

Add CSS custom properties for paper, ink, clay, rule, and muted text. Add serif and sans font stacks, generous spacing, thin rules, visible `:focus-visible`, `scroll-behavior`, a subtle paper grain using CSS gradients, and reduced-motion overrides. Do not add shadows, glass surfaces, gradients used as decoration, or repeated rounded cards.

- [ ] **Step 4: Implement header behavior**

Create a small client `SiteHeader` with desktop links and one native button controlling a mobile navigation region. Links to home sections use `/#about`, `/#research`, `/#experience`, and `/#news`; Publications uses `/publications/`. Render CV only when configured.

- [ ] **Step 5: Add one deterministic hand-drawn primitive**

Create `RoughMark` using a stable SVG path and a `variant` union of `underline | arrow | circle`. Give decorative SVGs `aria-hidden="true"`; never regenerate paths on render.

- [ ] **Step 6: Run tests and commit**

Run: `npm test -- --run src/components/site-header.test.tsx && npm run build`

Expected: PASS and static export succeeds.

```bash
git add src/app src/components/site-header.tsx src/components/site-header.test.tsx src/components/rough-mark.tsx
git commit -m "feat: add editorial site shell"
```

### Task 4: Implement the Home Reading Column

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/about-section.tsx`
- Create: `src/components/research-section.tsx`
- Create: `src/components/experience-section.tsx`
- Create: `src/components/news-section.tsx`
- Test: `src/components/home-sections.test.tsx`

- [ ] **Step 1: Write failing section tests**

Assert semantic section IDs `about`, `research`, `experience`, and `news`; verify the three research interests; verify only confirmed experience text appears; verify news is sorted newest first; verify an empty news array produces no News section.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- --run src/components/home-sections.test.tsx`

Expected: FAIL because the section components do not exist.

- [ ] **Step 3: Implement About and Research Interests**

Use the approved editorial heading and concise biography. Render research interests as numbered rows separated by thin rules. Apply one clay rough underline to “reason about physics.”

- [ ] **Step 4: Implement Experience and News**

Render Experience as a semantic list with a thin timeline. Render News in a labeled region with `tabIndex={0}` only when desktop overflow exists through CSS; cap the desktop region at a readable height with `overflow-y: auto`, and remove both cap and overflow below the mobile breakpoint.

- [ ] **Step 5: Compose the home page**

Create a two-column page shell with the reading column first in source order and the identity rail second. Use CSS grid on desktop and reorder the identity rail visually before content on mobile without changing meaningful heading order.

- [ ] **Step 6: Run tests and commit**

Run: `npm test -- --run src/components/home-sections.test.tsx && npm run build`

Expected: PASS and `out/index.html` exists.

```bash
git add src/app/page.tsx src/components/about-section.tsx src/components/research-section.tsx src/components/experience-section.tsx src/components/news-section.tsx src/components/home-sections.test.tsx
git commit -m "feat: build academic home sections"
```

### Task 5: Implement the Identity Rail and Contact Interactions

**Files:**
- Create: `src/components/identity-rail.tsx`
- Create: `src/components/wechat-dialog.tsx`
- Test: `src/components/identity-rail.test.tsx`
- Test: `src/components/wechat-dialog.test.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write failing identity tests**

Assert the rail renders name, role, institution, GitHub, and Google Scholar with icons and text. Assert empty LinkedIn, WeChat, and Email values are absent. With a WeChat QR value, click the trigger, verify a dialog, press Escape, and verify focus returns to the trigger.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- --run src/components/identity-rail.test.tsx src/components/wechat-dialog.test.tsx`

Expected: FAIL because the components do not exist.

- [ ] **Step 3: Implement the identity rail**

Use monochrome React Icons for GitHub, Google Scholar, LinkedIn, WeChat, and Email. Each row contains icon, visible label, and clay action marker. External links receive `target="_blank"` and `rel="noreferrer"`. If portrait is empty, render a restrained CSS silhouette with accessible text “Portrait not yet provided”; never request a stock image.

- [ ] **Step 4: Implement the WeChat dialog**

Use native `<dialog>` where supported, a labeled close button, Escape handling, focus restoration, and a QR image with descriptive alt text. Keep the trigger absent when no QR path exists.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- --run src/components/identity-rail.test.tsx src/components/wechat-dialog.test.tsx && npm run build`

Expected: PASS.

```bash
git add src/components/identity-rail.tsx src/components/identity-rail.test.tsx src/components/wechat-dialog.tsx src/components/wechat-dialog.test.tsx src/app/page.tsx
git commit -m "feat: add academic identity rail"
```

### Task 6: Build the Publications Archive

**Files:**
- Create: `src/app/publications/page.tsx`
- Create: `src/components/publication-list.tsx`
- Create: `src/components/publication-actions.tsx`
- Create: `src/components/paper-figure.tsx`
- Test: `src/components/publication-list.test.tsx`
- Test: `src/components/publication-actions.test.tsx`

- [ ] **Step 1: Write failing publication tests**

Assert reverse chronological order, author emphasis using `<strong>`, optional TL;DR and award visibility, image alt behavior, hidden absent actions, and inline BibTeX expansion. Mock `navigator.clipboard.writeText` and verify the configured citation is copied.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- --run src/components/publication-list.test.tsx src/components/publication-actions.test.tsx`

Expected: FAIL because the publication components do not exist.

- [ ] **Step 3: Implement publication figures**

When `image` exists, render the supplied figure with explicit dimensions and relevant alt text. Otherwise render a deterministic paper-toned diagram selected by publication `category`; mark the diagram decorative.

- [ ] **Step 4: Implement publication rows and actions**

Render semantic `<article>` rows with figure left and information right. Parse the already structured author list rather than splitting display strings. Use buttons for BibTeX disclosure and copy; show a short `aria-live="polite"` confirmation after copy.

- [ ] **Step 5: Add route metadata and compose the page**

Set the page title to `Publications — Ruizhe Zhou`, description to the verified research themes, and render the header plus sorted list.

- [ ] **Step 6: Run tests and commit**

Run: `npm test -- --run src/components/publication-list.test.tsx src/components/publication-actions.test.tsx && npm run build`

Expected: PASS and `out/publications/index.html` exists.

```bash
git add src/app/publications src/components/publication-list.tsx src/components/publication-list.test.tsx src/components/publication-actions.tsx src/components/publication-actions.test.tsx src/components/paper-figure.tsx
git commit -m "feat: add publications archive"
```

### Task 7: Add Browser-Level Responsive and Accessibility Checks

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/portfolio.spec.ts`
- Modify: `package.json`

- [ ] **Step 1: Write the browser test**

Test desktop navigation to `/publications/`, keyboard access to News, absence of horizontal overflow at 1440×900 and 390×844, mobile menu expansion, publication order, and reduced-motion media emulation.

- [ ] **Step 2: Run the browser test and record failures**

Run: `npm run test:e2e`

Expected: the first run identifies any remaining layout or focus defect.

- [ ] **Step 3: Fix only observed defects**

Adjust the owning component or `globals.css`; do not introduce new visual sections. Re-run the focused unit test for every changed component.

- [ ] **Step 4: Run the complete suite**

Run: `npm test -- --run && npm run test:e2e && npm run lint && npm run build`

Expected: all commands exit 0; `out/` contains home and publications routes.

- [ ] **Step 5: Commit verification coverage**

```bash
git add playwright.config.ts e2e package.json package-lock.json src
git commit -m "test: cover portfolio accessibility and layout"
```

### Task 8: Configure GitHub Pages Deployment

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `README.md`

- [ ] **Step 1: Add the Pages workflow**

Create a workflow triggered on pushes to `main` and manual dispatch. Grant `contents: read`, `pages: write`, and `id-token: write`; use checkout, Node setup with npm cache, `npm ci`, tests, build, `actions/configure-pages`, `actions/upload-pages-artifact` with `./out`, and `actions/deploy-pages`.

- [ ] **Step 2: Document content maintenance**

Explain which file owns profile, research, experience, news, and publication content; list the expected media directories; state that empty optional fields are hidden; document `npm run dev`, `npm test -- --run`, and `npm run build`.

- [ ] **Step 3: Validate the workflow and export**

Run: `npm test -- --run && npm run lint && npm run build && test -f out/index.html && test -f out/publications/index.html`

Expected: all commands exit 0.

- [ ] **Step 4: Inspect the final diff for unrelated legacy deletions**

Run: `git status --short && git diff --check`

Expected: legacy deletions remain outside this plan's staged changes; no whitespace errors exist.

- [ ] **Step 5: Commit deployment configuration**

```bash
git add .github/workflows/deploy-pages.yml README.md
git commit -m "ci: deploy portfolio to GitHub Pages"
```

## Final Acceptance

- [ ] Replace optional portrait, paper figures, LinkedIn URL, WeChat QR, email, and CV only with values supplied by Ruizhe Zhou.
- [ ] Cross-check every publication against the researcher's confirmed list; remove any namesake or incomplete entry.
- [ ] Run the complete unit, browser, lint, type, and production-build checks.
- [ ] Review at desktop and mobile sizes and remove any decoration that does not reinforce the editorial academic identity.
- [ ] Confirm GitHub Pages is enabled for GitHub Actions before the first deployment.
