"use client";

import { useState } from "react";
import { sitePath } from "@/lib/site-path";

interface PaperFigureProps {
  title: string;
  category: string;
  image?: string;
  imageAlt?: string;
  pdfMedia?: string;
}

function fallbackCategory(category: string) {
  if (category === "physical-ai" || category === "world-models") return category;
  return "text-detection";
}

export function PaperFigure({
  title,
  category,
  image,
  imageAlt,
  pdfMedia,
}: PaperFigureProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (pdfMedia) {
    const pdfPath = sitePath(pdfMedia);
    return (
      <figure className="paper-figure paper-figure--uniform paper-figure--pdf">
        <object
          data={pdfPath}
          type="application/pdf"
          aria-label={`Vector preview of ${title}`}
        >
          <a
            href={pdfPath}
            target="_blank"
            rel="noreferrer"
            aria-label="Open vector PDF (opens in a new tab)"
          >
            Open vector PDF ↗
          </a>
        </object>
      </figure>
    );
  }

  if (image && !imageFailed) {
    return (
      <figure className="paper-figure paper-figure--uniform">
        {/* Static export images are deliberately native and base-path prefixed. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sitePath(image)}
          width="560"
          height="350"
          alt={imageAlt ?? `Figure from ${title}`}
          onError={() => setImageFailed(true)}
        />
      </figure>
    );
  }

  const safeCategory = fallbackCategory(category);
  return (
    <figure
      className={`paper-figure paper-figure--uniform paper-figure--fallback paper-figure--${safeCategory}`}
      data-figure-category={safeCategory}
      aria-hidden="true"
    >
      <span className="paper-figure__orb" />
      <span className="paper-figure__axis" />
      <span className="paper-figure__trace" />
      {safeCategory === "physical-ai" ? <span className="paper-figure__core" /> : null}
    </figure>
  );
}
