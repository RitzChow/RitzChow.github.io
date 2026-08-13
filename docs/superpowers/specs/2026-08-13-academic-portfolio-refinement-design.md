# Academic Portfolio Refinement — Design Specification

## Scope

Refine the existing English academic portfolio without changing its warm editorial identity. This revision uses the user-supplied assets in `image/`, tightens the navigation and home-page rhythm, adds confirmed contact methods, updates the publication archive to four current papers, and introduces publication filtering.

## Asset Policy

The supplied assets are:

- `image/my photo.jpg`: square profile portrait.
- `image/WeChat.jpg`: WeChat QR code.
- `image/A Survey on Physical AI.pdf`: one-page vector publication figure.
- `image/When Prompts Become Pixels.pdf`: one-page vector publication figure.
- `image/Models Under SCOPE.pdf`: one-page vector publication figure.

The three PDFs must be served and embedded directly as vector documents. They must not be rasterized, cropped, or converted to screenshots. Each embedded PDF has a fallback link that opens the original file. The Position Paper has no supplied figure and continues to use a deterministic, paper-toned abstract fallback.

Assets are copied or moved into a publicly served `image/` directory while preserving recognizable filenames or documented normalized equivalents. Static asset URLs remain compatible with both the user Pages repository and project Pages base paths.

## Navigation

- Reduce header height, maximum inner width, and link gaps.
- Reduce the space between the header and the About section.
- Keep the header visible while scrolling with `position: sticky`.
- Use an opaque or lightly translucent warm-paper surface with a thin lower rule so content does not become unreadable beneath it.
- Preserve the existing accessible mobile menu and keyboard behavior.

## Home Page Composition

Desktop remains an asymmetric two-column layout.

### Left Reading Column

The section order becomes:

1. About
2. News
3. Research Interests
4. Experience

News uses the available left-column width and a fixed maximum height on desktop. When content overflows, scrolling the pointer, touch surface, or keyboard over the News region scrolls the News list rather than the page. Focusability and scroll-region semantics appear only when the list actually overflows. On mobile, the height cap and nested scrolling are removed and News expands naturally.

### Right Identity Rail

- Use the supplied square portrait.
- Render the portrait in a square frame with editorial texture: double thin rules, a slight imperfect offset, and restrained paper/clay accents. Do not introduce a rounded card or heavy shadow.
- Show GitHub, Google Scholar, LinkedIn, Email, and WeChat as monochrome icon-plus-text rows.
- Normalize the configured raw email to `mailto:z1459306087@gmail.com`; clicking opens a composed email with that recipient.
- Clicking WeChat opens the supplied QR code in the existing accessible modal dialog.
- Keep missing optional values hidden.

## Publications

The archive contains exactly these four papers, using authoritative arXiv/OpenReview metadata and the user-provided Google Scholar citation links:

1. Aligning Perception, Reasoning, Modeling and Interaction: A Survey on Physical AI.
2. When Prompts Become Pixels: Prompt-Region Grounding for Multimodal Reasoning.
3. Models Under SCOPE: Scalable and Controllable Routing via Pre-hoc Reasoning.
4. Position: The Physics-Physical Reasoning Interplay is Key for Future Embodied World Models.

LLM-Detector is removed from the displayed archive.

### Author Marks

- Physical AI Survey: Kun Xiang, Terry Jingchen Zhang, and Yinya Huang receive `*`; Xiaodan Liang receives `†`.
- Position Paper: Terry Jingchen Zhang, Kun Xiang, and Yinya Huang receive `*`; Xiaodan Liang receives `†`.
- When Prompts Become Pixels and Models Under SCOPE receive no author marks until confirmed.
- Marked papers display `* Equal contribution · † Corresponding author` below the author list.
- Symbols are textual and accessible; color is not the sole carrier of meaning.

### Vector Figures

- Survey, Visual Prompt Grounding, and SCOPE embed their supplied one-page PDFs directly.
- PDF previews preserve the source aspect ratio within a bounded publication-media area.
- Users can open the original PDF when inline embedding is unavailable.
- The Position Paper uses its deterministic fallback illustration.

## Publication Filter

Place a compact segmented control below the Publications heading and above the first paper. Its interaction density is inspired by the supplied Claude pricing selector, but colors, typography, dimensions, and details remain original to this portfolio.

Options:

- All: all four papers.
- Physical: Physical AI Survey and Position Paper.
- Visual: When Prompts Become Pixels.

Models Under SCOPE appears only under All.

The control is implemented as an accessible single-selection tab or radio-style group. Selection updates the list without navigation, preserves publication order, exposes its selected state to assistive technology, supports keyboard operation, and respects reduced-motion preferences.

## Content Model Changes

- Add a publication filter category that is independent of research category and publication type.
- Add structured author contribution markers instead of embedding symbols in author names.
- Add optional vector PDF media alongside existing raster image media.
- Keep external Scholar/arXiv/OpenReview/project links explicit.
- Normalize contact links at the data or rendering boundary so raw email values cannot generate broken navigation.

## Verification

The refinement is complete after verifying:

- Sticky compact header and reduced first-section gap.
- Home section order.
- Desktop News internal scrolling and mobile expansion.
- Square portrait and textured frame.
- Email `mailto:` behavior.
- WeChat QR modal, Escape handling, focus restoration, and fallback modality.
- Exactly four publications in correct reverse chronological order.
- Direct vector PDF embedding and fallback links.
- All/Physical/Visual filtering, counts, keyboard behavior, and empty-category prevention.
- Author contribution symbols and legends only on confirmed papers.
- Desktop, tablet, and mobile layouts without horizontal overflow.
- GitHub Pages user-repository and project-base-path exports.
- Unit/component tests, Playwright tests, lint, TypeScript, production build, and dependency audit.

## Non-Goals

- No PDF rasterization or figure cropping.
- No invented author contribution roles.
- No new publication category for SCOPE; it remains All-only.
- No redesign of the overall warm editorial visual identity.
