# Homepage Information Architecture Refinement

## Goal

Simplify the homepage hierarchy, move research interests into the identity rail, and present education and research-assistant experience as compact institution-led resume rows.

## Navigation

- Use this order: `About`, `Publications`, `Education`, `Experience`, `News`.
- Remove `Research` from the navigation.
- `Education` links to the homepage education section.
- Keep the existing sticky header and mobile menu behavior.

## Homepage hierarchy

- Remove the large headings:
  - `Understanding intelligence through the physical world.`
  - `Research interests`
  - `Academic experience`
- Keep small editorial section labels where needed for orientation.
- Preserve the current two-column desktop layout and single-column mobile layout.
- Left column order: About copy, News, then the Education/Experience pair.
- Education and Experience appear side by side on desktop and stack on mobile.

## Research interests

- Move Research Interests from the main content column to the right identity rail.
- Place it beneath the portrait, identity text, and contact actions.
- Use one quiet rounded rectangle with no shadow.
- Show exactly three concise entries:
  - Physical Intelligence
  - Visual Intelligence
  - Multimodal
- Keep the visual treatment secondary to the portrait and identity information.

## Education and experience presentation

- Use institution rows inspired by the existing editorial resume treatment: thin horizontal rules, a small clay-colored marker, and restrained typography.
- Each school occupies one full row inside its section.
- Each row begins with the institution's real official horizontal logo/wordmark including the school name.
- The logo must be displayed as an actual image, not a text placeholder or recreated mark.
- Prefer an official SVG. If the official source only provides EPS or another vector format, convert it losslessly to SVG without redrawing the mark.
- Do not source logos from third-party logo repositories.
- Preserve official proportions, colors, clear space, and readable alt text.
- Logo images use `object-fit: contain` and are never cropped or stretched.
- Supporting details sit below the logo and can grow later without changing the row structure.

### Education

- Institution: Sun Yat-sen University.
- Display the official horizontal Sun Yat-sen University logo containing the school name.
- Date: `2023.09–2027.06`.
- Use a concise undergraduate education label; additional degree details may remain empty.

### Experience

- Row 1: UNC Chapel Hill, `Research Assistant`, date shown as `—` until supplied.
- Row 2: UC San Diego, `Research Assistant`, date shown as `—` until supplied.
- Use each institution's official horizontal logo containing the school name.
- Leave advisor, laboratory, project, and description details empty until the user supplies them; do not render empty labels.

## About and News

- About keeps the biography but no longer renders the large statement heading.
- News retains the already-approved small `News` heading and description-only measured scroller.
- Do not restore `Latest updates` or per-item title links.

## Publications page

- Remove the sentence: `Selected work on intelligence grounded in physical systems and reliable language technologies.`
- Keep the `Research archive` eyebrow, `Publications` heading, centered filter, author legend, and publication rows.
- Preserve the approved uniform vector preview behavior.

## Responsive behavior

- Desktop: main content and identity rail remain aligned at the top; Education and Experience are two equal-width columns.
- Mobile: identity rail remains before main content according to the existing layout; Research Interests follows contact actions; Education and Experience stack vertically.
- Institution logos remain readable and fully contained at all widths.
- No horizontal overflow is introduced.

## Accessibility

- Section anchors remain available even without large visible headings.
- Each section has an accessible name through a visible small heading or `aria-labelledby`.
- Official logo images include concise institution-specific alt text.
- Empty dates/details do not create empty focus targets or unlabeled content.

## Verification

- Unit tests cover navigation labels/order, removed large headings, relocated interests, institution data, optional empty details, and removed Publications sentence.
- Asset tests confirm all three official logo files exist, are valid SVG/vector assets, and have no scripts or external resource references.
- Browser tests cover desktop side-by-side layout, mobile stacking, working anchors, visible logos, no horizontal overflow, and preservation of the News and Publications behavior.

## Out of scope

- Inventing research details, advisor names, laboratories, projects, RA dates, or degree names not supplied by the user.
- Redesigning publication filters or vector paper previews.
- Changing the portrait, contact values, or News content data.
