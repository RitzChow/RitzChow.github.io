"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Publication, PublicationFilterGroup } from "@/data/types";
import { PublicationList } from "./publication-list";

type Filter = "all" | "featured" | PublicationFilterGroup;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "featured", label: "Featured" },
  { id: "physical", label: "Physical" },
  { id: "visual", label: "Visual" },
];

export function PublicationArchive({ publications }: { publications: Publication[] }) {
  const [selected, setSelected] = useState<Filter>("all");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectByIndex(index: number) {
    const next = filters[index];
    setSelected(next.id);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % filters.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + filters.length) % filters.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = filters.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    selectByIndex(nextIndex);
  }

  const visible = selected === "all"
    ? publications
    : selected === "featured"
      ? publications.filter(({ featured }) => featured)
      : publications.filter(({ filterGroups }) => filterGroups?.includes(selected));

  return (
    <>
      <div
        className="publication-filter"
        role="tablist"
        aria-label="Filter publications"
        data-selected={selected}
      >
        {filters.map((filter, index) => {
          const isSelected = filter.id === selected;
          return (
            <button
              key={filter.id}
              ref={(element) => { tabRefs.current[index] = element; }}
              type="button"
              role="tab"
              id={`publication-filter-${filter.id}`}
              aria-controls="publication-results"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelected(filter.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
      <p className="publication-author-legend">* Equal contribution · † Corresponding author</p>
      <div
        id="publication-results"
        role="tabpanel"
        aria-labelledby={`publication-filter-${selected}`}
      >
        <PublicationList publications={visible} />
      </div>
    </>
  );
}
