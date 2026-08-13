# Homepage Information Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the homepage hierarchy, add institution-led Education and Experience rows with official vector logos, move Research Interests into the identity rail, and align navigation and Publications copy with the new structure.

**Architecture:** Add explicit education and experience data for three institutions, render both through a shared institution-row component, and compose them in a responsive two-column block. Keep identity information responsible for the right rail and add a small interests panel there. Treat official logo assets as verified local SVG files and preserve all existing News and publication-preview behavior.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, official SVG/EPS brand assets, Vitest/Testing Library, Playwright

---

### Task 1: Acquire and verify official institution logos

**Files:**
- Create: `public/image/sysu-logo.svg`
- Create: `public/image/unc-logo.svg`
- Create: `public/image/uc-san-diego-logo.svg`
- Create: `src/data/institutions.test.ts`

- [ ] **Step 1: Locate first-party vector sources**

Use only official university domains and record the direct source URL in an SVG comment or the test fixture:

```ts
const officialDomains = ["sysu.edu.cn", "unc.edu", "ucsd.edu"];
```

Prefer SVG downloads. If an official brand site supplies EPS, convert the EPS to SVG without redrawing or rasterizing. Stop and report a blocker if a legitimate first-party vector source cannot be obtained; do not use Wikipedia, Wikimedia, third-party logo sites, or recreated text.

- [ ] **Step 2: Add failing asset-integrity tests**

For each configured asset, require:

```ts
expect(svg).toMatch(/<svg\b/);
expect(svg).toMatch(/viewBox=/);
expect(svg).toMatch(/<(?:path|polygon|polyline|rect|text)\b/);
expect(svg).not.toMatch(/<script\b/i);
expect(svg).not.toMatch(/(?:href|src)=["']https?:/i);
```

Also require a first-party source URL and an accessible institution name in the data that will consume the asset.

- [ ] **Step 3: Validate and visually inspect the assets**

Run:

```bash
xmllint --noout public/image/sysu-logo.svg public/image/unc-logo.svg public/image/uc-san-diego-logo.svg
npm test -- --run src/data/institutions.test.ts
```

Expected: all XML and asset-integrity checks pass. Render each SVG in Chromium and confirm the full horizontal wordmark is visible, uncropped, and retains official colors.

- [ ] **Step 4: Commit verified logo assets**

```bash
git add public/image/sysu-logo.svg public/image/unc-logo.svg public/image/uc-san-diego-logo.svg src/data/institutions.test.ts
git commit -m "add official university logo assets"
```

### Task 2: Model and render Education and Experience institution rows

**Files:**
- Create: `src/data/education.ts`
- Modify: `src/data/experience.ts`
- Modify: `src/data/types.ts`
- Create: `src/components/institution-row.tsx`
- Create: `src/components/education-section.tsx`
- Modify: `src/components/experience-section.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/home-sections.test.tsx`
- Modify: `src/app/page.test.tsx`

- [ ] **Step 1: Write failing data and rendering tests**

Require one Education row and two Experience rows:

```ts
expect(education).toEqual(expect.arrayContaining([
  expect.objectContaining({ institution: "Sun Yat-sen University", displayDate: "2023.09–2027.06" }),
]));
expect(experience.map(({ institution }) => institution)).toEqual([
  "UNC Chapel Hill",
  "UC San Diego",
]);
```

Require real logo `<img>` elements with institution-specific alt text, `Research Assistant` for both experiences, visible `—` dates, and no empty Lab/Advisor/Project labels.

- [ ] **Step 2: Implement a shared institution-row contract**

Extend the entry type with required `logo` and `logoAlt` fields. Implement `InstitutionRow` so both sections share the same row markup:

```tsx
<article className="institution-row">
  <img className="institution-row__logo" src={sitePath(item.logo)} alt={item.logoAlt} />
  <h3>{item.role}</h3>
  <p>{item.institution}</p>
  <time>{item.displayDate}</time>
</article>
```

Render optional details only when values exist. Create an `education-experience-grid` containing independent `#education` and `#experience` sections. Preserve accessible section labels without the removed `Academic experience` heading.

- [ ] **Step 3: Run focused tests and commit**

```bash
npm test -- --run src/components/home-sections.test.tsx src/app/page.test.tsx
git add src/data/education.ts src/data/experience.ts src/data/types.ts src/components/institution-row.tsx src/components/education-section.tsx src/components/experience-section.tsx src/app/page.tsx src/components/home-sections.test.tsx src/app/page.test.tsx
git commit -m "add education and research experience rows"
```

### Task 3: Simplify About and move Research Interests into the identity rail

**Files:**
- Modify: `src/components/about-section.tsx`
- Modify: `src/components/identity-rail.tsx`
- Modify: `src/data/research.ts`
- Modify: `src/components/home-sections.test.tsx`
- Modify: `src/components/identity-rail.test.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/globals.test.ts`

- [ ] **Step 1: Write failing hierarchy tests**

Require the absence of all removed headings and the right-rail entries:

```ts
expect(screen.queryByText("Understanding intelligence through the physical world.")).not.toBeInTheDocument();
expect(screen.queryByRole("heading", { name: "Research interests" })).not.toBeInTheDocument();
expect(screen.queryByRole("heading", { name: "Academic experience" })).not.toBeInTheDocument();
expect(within(identityRail).getByText("Physical Intelligence")).toBeInTheDocument();
expect(within(identityRail).getByText("Visual Intelligence")).toBeInTheDocument();
expect(within(identityRail).getByText("Multimodal")).toBeInTheDocument();
```

- [ ] **Step 2: Implement the simplified hierarchy**

Remove the About statement `<h1>` and keep the small visible About heading as the section's accessible label. Remove the main-column Research section from `page.tsx`. Update research data to the exact three short labels and render them in a no-shadow rounded `.identity-interests` panel after contact actions.

- [ ] **Step 3: Style and verify the rail panel**

Use a subtle one-pixel rule, restrained radius, no shadow, and a compact list. Confirm `.home-grid` and `.identity-rail` receive no new desktop top offsets so About and portrait remain aligned.

Run focused tests and commit:

```bash
npm test -- --run src/components/home-sections.test.tsx src/components/identity-rail.test.tsx src/app/globals.test.ts
git add src/components/about-section.tsx src/components/identity-rail.tsx src/data/research.ts src/components/home-sections.test.tsx src/components/identity-rail.test.tsx src/app/globals.css src/app/globals.test.ts src/app/page.tsx
git commit -m "simplify homepage hierarchy and interests"
```

### Task 4: Update navigation, Publications copy, and responsive styling

**Files:**
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/site-header.test.tsx`
- Modify: `src/app/publications/page.tsx`
- Modify: `src/app/publications/page.test.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/globals.test.ts`
- Modify: `e2e/portfolio.spec.ts`

- [ ] **Step 1: Add failing navigation and copy tests**

Require this exact navigation order:

```ts
expect(labels).toEqual(["About", "Publications", "Education", "Experience", "News"]);
```

Require the Publications page not to contain the removed sentence while retaining `Research archive` and the `Publications` heading.

- [ ] **Step 2: Implement navigation and copy cleanup**

Remove Research, add Education between Publications and Experience, and preserve desktop/mobile menu behavior. Remove only the Publications introductory sentence.

- [ ] **Step 3: Implement the final responsive layout**

Style `.education-experience-grid` as two equal columns on desktop and one column on mobile. Style each institution row with thin rules and a small marker. Constrain logo boxes without cropping:

```css
.institution-row__logo {
  display: block;
  width: min(100%, 12rem);
  height: 3rem;
  object-fit: contain;
  object-position: left center;
}
```

- [ ] **Step 4: Run comprehensive verification**

```bash
npm test -- --run
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
git diff --check
```

Expected: all unit tests, lint, type-check, build, and Playwright tests pass. Browser checks cover logo visibility, desktop columns, mobile stacking, anchor navigation, News behavior, Publications vector previews, and no horizontal overflow.

- [ ] **Step 5: Commit final integration**

```bash
git add src/components/site-header.tsx src/components/site-header.test.tsx src/app/publications/page.tsx src/app/publications/page.test.tsx src/app/globals.css src/app/globals.test.ts e2e/portfolio.spec.ts
git commit -m "align navigation and homepage layout"
```
