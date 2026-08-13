# Publication Media Canvas Refinement

## Goal

Give every publication row a consistent, restrained visual rhythm even when the source PDF pages use different aspect ratios.

## Media presentation

- Every publication media area uses the same responsive `16 / 9` canvas.
- The canvas has a plain white background and a single low-contrast border.
- Vector PDFs remain embedded directly as PDFs.
- Each PDF is centered and scaled proportionally to fit entirely inside the canvas.
- PDFs must not be cropped, stretched, rasterized, or enlarged beyond the canvas.
- Space not occupied by the PDF remains plain white.
- The Position paper fallback artwork uses the same `16 / 9` canvas and restrained treatment.
- Desktop and mobile use the same aspect ratio; only the available width changes.

## Author notation legend

- Show `* Equal contribution · † Corresponding author` once above the publication list.
- Increase its size and contrast from the current implementation so it is clearly readable.
- Keep it visually secondary to the publication filter and paper titles.
- Do not repeat the legend inside individual publication rows.

## Accessibility and motion

- Preserve the existing accessible PDF fallback link.
- Preserve the existing filter keyboard behavior and reduced-motion support.
- The white canvas border must remain visible against the warm page background without relying on shadow alone.

## Verification

- Component tests confirm every media figure receives the same `16 / 9` presentation.
- Tests confirm PDF source URLs and fallback links remain unchanged.
- Tests confirm the author legend appears once and not inside any article.
- Browser checks cover desktop and mobile widths, absence of horizontal overflow, and complete uncropped PDF presentation.

## Out of scope

- Changing publication metadata, ordering, categories, or Featured membership.
- Rasterizing or editing the supplied PDFs.
- Adding new publication images.
