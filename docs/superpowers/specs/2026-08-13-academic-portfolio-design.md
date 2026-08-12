# Ruizhe Zhou Academic Portfolio — Design Specification

## Purpose

Create an English-language academic portfolio for Ruizhe Zhou, an undergraduate researcher at Sun Yat-sen University. The site should feel like an academic notebook shaped by an editorial designer: warm, intelligent, credible, personal, and restrained.

The first release will use verified publication and GitHub information where available. Missing affiliation details, experience details, contact values, CV, portrait, WeChat QR code, and paper figures remain optional structured fields. The UI must hide absent content rather than publish placeholders or invented information.

## Visual Direction

### Palette

- Paper background: warm off-white, approximately `#F3EEE4`.
- Primary ink: near-black, approximately `#201E1A`.
- Accent: restrained clay/terracotta, approximately `#9B4932`.
- Rules and dividers: warm gray, approximately `#CBC1B2`.
- Secondary text: muted warm gray with accessible contrast.

### Typography

- Expressive serif for the researcher's name, page headings, publication titles, and narrative statements.
- Neutral sans-serif for navigation, dates, affiliations, metadata, links, and controls.
- Generous line height and whitespace; no oversized marketing hero treatment.
- Ruizhe Zhou's name in author lists receives a subtle clay underline or weight change.

### Layout Language

- Thin horizontal and vertical rules replace cards and shadows.
- Desktop uses an asymmetric two-column composition: the main reading column on the left and a narrower identity rail on the right.
- The right rail contains portrait, name, role, institution, and contact links.
- Mobile collapses to one column, placing the identity block before the main content.
- Hand-drawn details are sparse: one imperfect underline, circle, arrow, or margin annotation at meaningful points. Decorations use deterministic SVG paths or Rough.js seeds.
- Motion is limited to a subtle initial reveal, link movement, and selected hand-drawn strokes. All motion respects `prefers-reduced-motion`.

## Information Architecture

### Home (`/`)

The home page provides a complete academic overview in this order:

1. About
2. Research Interests
3. Experience
4. News

Desktop navigation contains About, Research, Publications, Experience, News, and CV. About, Research, Experience, and News navigate to home-page anchors. Publications opens the dedicated publications route. CV opens a PDF in a new tab only when a CV file is configured; otherwise the link is hidden.

### Publications (`/publications`)

The publications page shows the complete publication list in reverse chronological order. Each publication is a vertically composed editorial row:

- Paper figure or restrained generated placeholder on the left.
- Year and publication type.
- Title.
- Complete author list with Ruizhe Zhou subtly highlighted.
- Venue and year.
- Optional award, oral, or spotlight note.
- Optional TL;DR.
- Paper, Code, Project, and BibTeX actions when configured.

On narrow screens, the figure stacks above the publication information.

## Home Page Sections

### About

The About section leads the main column rather than repeating a conventional portfolio hero. It contains a short research identity statement and at most two concise paragraphs. The working direction is physically grounded intelligence, physics reasoning, and multimodal evaluation; the copy remains editable as profile information is refined.

### Research Interests

Research interests are shown as numbered editorial rows with a title and one-sentence explanation. Initial categories are:

1. Physical AI
2. Physics reasoning
3. Multimodal evaluation

These are data-driven and may be changed without editing layout code.

### Experience

Experience uses a simple vertical timeline with dates, role, institution, and optional lab, advisor, project, and description. Entries with missing required display content are omitted. The present SYSU undergraduate researcher role may be shown; unconfirmed lab and advisor information must remain hidden.

### News

News appears at the bottom of the left column. On desktop, it has a fixed readable height and scrolls vertically for older entries. On mobile, the fixed height and nested scrolling are removed so all items flow naturally in the page. Each item contains a date and short text with an optional link.

## Identity Rail

The desktop identity rail contains:

- Portrait.
- Ruizhe Zhou.
- Undergraduate Researcher.
- Sun Yat-sen University.
- GitHub.
- Google Scholar.
- LinkedIn.
- WeChat.
- Email.

Contact links use a recognizable monochrome icon plus text and a small clay-colored action indicator. GitHub, Google Scholar, LinkedIn, and Email navigate directly. WeChat opens an accessible dialog containing the QR code. Any contact item with no configured value is hidden. Until a portrait is supplied, the production site uses a restrained paper-toned placeholder or omits the portrait based on final content review; it must not use a stock photograph.

## Content Architecture

Academic content is stored separately from presentation code:

- `profile.ts`: name, role, institution, biography, portrait, CV, and contact values.
- `research.ts`: research interests.
- `experience.ts`: dated academic and research experience.
- `news.ts`: dated updates.
- `publications.ts`: publication metadata, media, links, TL;DR, and BibTeX.

Optional fields use explicit empty or omitted values. Components filter absent content and never render empty controls, broken images, fake dates, or placeholder academic claims.

## Interaction Details

- Navigation anchors account for the sticky header offset if the header is sticky.
- The News region is keyboard-scrollable on desktop and labeled for assistive technology.
- BibTeX expands inline within its publication row and supports copying when content exists.
- The WeChat QR dialog traps focus, closes with Escape, has a labeled close action, and returns focus to its trigger.
- External links are visibly identifiable and include accessible labels.
- Hover effects are subtle and do not carry essential meaning.

## Responsive Behavior

- Desktop: left reading column plus right identity rail.
- Tablet: narrower rail and reduced gaps while preserving two columns when readable.
- Mobile: one column; identity block first, content second; publication images stack above text; News fully expands; navigation becomes a compact accessible menu.
- No horizontal page overflow at supported widths.

## SEO and Performance

- Site title and description describe Ruizhe Zhou and the main research areas.
- Semantic headings, landmarks, publication articles, and link labels are used throughout.
- Static academic data enables fast rendering and simple GitHub Pages deployment.
- Images use responsive dimensions, lazy loading below the fold, and meaningful alt text when informative. Decorative figures use empty alt text.
- No remote runtime dependency is required for academic content.

## Error and Empty States

- Missing optional values remove their UI entirely.
- A missing publication figure falls back to a deterministic, paper-toned abstract diagram tied to the publication category.
- A failed portrait does not show a broken image icon.
- A missing CV, WeChat QR code, or BibTeX value hides the corresponding action.
- External link failures remain normal browser navigation failures; the site does not claim link availability.

## Verification

Implementation is complete only after verifying:

- Desktop, tablet, and mobile layouts.
- Keyboard navigation and visible focus states.
- Reduced-motion behavior.
- Home anchor navigation.
- Desktop News scrolling and mobile News expansion.
- BibTeX expand/collapse and copy behavior.
- WeChat dialog behavior when configured.
- Hidden optional fields and missing-image fallbacks.
- Correct publication ordering and author emphasis.
- Successful production build for GitHub Pages.
- No generic portfolio cards, stock imagery, purple gradients, glass effects, or unnecessary animation.

## Initial Verified Sources

- Google Scholar profile: `https://scholar.google.com/citations?hl=zh-CN&user=YzbWQgYAAAAJ`
- GitHub profile: `https://github.com/RitzChow`
- Physical AI survey: `https://arxiv.org/abs/2510.04978`
- Physics–Physical Reasoning position paper: `https://openreview.net/forum?id=XF7kHMLdWX`
- LLM-Detector: `https://arxiv.org/abs/2402.01158`

Publication data must be checked against the researcher's final list before launch because public indexing may be incomplete or merge namesakes.

## Explicit Non-Goals for the First Release

- No content-management system.
- No authentication, database, analytics dashboard, or live Scholar synchronization.
- No image-heavy project gallery.
- No unconfirmed biography, experience, publication, award, contact, or affiliation claims.
- No Notes or Projects route until content for those sections is supplied.
