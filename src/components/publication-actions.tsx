"use client";

import { useState } from "react";
import type { PublicationLinks } from "@/data/types";

interface PublicationActionsProps {
  links: PublicationLinks;
  bibtex?: string;
}

const configuredLinks: Array<[keyof PublicationLinks, string]> = [
  ["paper", "Paper"],
  ["scholar", "Scholar"],
  ["code", "Code"],
  ["project", "Project"],
];

export function PublicationActions({ links, bibtex }: PublicationActionsProps) {
  const [bibtexOpen, setBibtexOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  async function copyBibtex() {
    if (!bibtex) return;
    try {
      await navigator.clipboard.writeText(bibtex);
      setCopyMessage("BibTeX copied.");
    } catch {
      setCopyMessage("Could not copy BibTeX. Please select and copy it manually.");
    }
  }

  return (
    <div className="publication-actions">
      <div className="publication-actions__links" aria-label="Publication links">
        {configuredLinks.map(([key, label]) =>
          links[key] ? (
            <a
              aria-label={`${label} (opens in a new tab)`}
              key={key}
              href={links[key]}
              target="_blank"
              rel="noreferrer"
            >
              {label}<span aria-hidden="true"> ↗</span>
            </a>
          ) : null,
        )}
        {bibtex ? (
          <button
            type="button"
            aria-expanded={bibtexOpen}
            onClick={() => {
              setBibtexOpen((open) => !open);
              setCopyMessage("");
            }}
          >
            {bibtexOpen ? "Hide BibTeX" : "Show BibTeX"}
          </button>
        ) : null}
      </div>
      {bibtex && bibtexOpen ? (
        <div className="publication-bibtex">
          <pre><code>{bibtex}</code></pre>
          <button type="button" onClick={copyBibtex}>Copy BibTeX</button>
          <p className="publication-copy-status" role="status" aria-live="polite">
            {copyMessage}
          </p>
        </div>
      ) : null}
    </div>
  );
}
