"use client";

import { useState } from "react";
import { sitePath } from "@/lib/site-path";

interface PaperFigureProps {
  title: string;
  category: string;
  image?: string;
  imageAlt?: string;
}

function fallbackCategory(category: string) {
  if (category === "physical-ai" || category === "world-models") return category;
  return "text-detection";
}

export function PaperFigure({ title, category, image, imageAlt }: PaperFigureProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (image && !imageFailed) {
    return (
      <figure className="paper-figure">
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
      className={`paper-figure paper-figure--fallback paper-figure--${safeCategory}`}
      data-figure-category={safeCategory}
      aria-hidden="true"
    >
      <span className="paper-figure__orb" />
      <span className="paper-figure__axis" />
      <span className="paper-figure__trace" />
    </figure>
  );
}
