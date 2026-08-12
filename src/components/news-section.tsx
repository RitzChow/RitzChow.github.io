"use client";

import { useEffect, useState } from "react";
import { news } from "@/data/news";
import type { NewsItem } from "@/data/types";
import { sortNews } from "@/lib/content";

type NewsSectionProps = {
  items?: readonly NewsItem[];
};

// Four updates fit within the desktop reading area without internal scrolling.
const NEWS_SCROLL_THRESHOLD = 4;
const DESKTOP_MEDIA_QUERY = "(min-width: 761px)";

export function NewsSection({ items = news }: NewsSectionProps) {
  const sortedItems = sortNews(items);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const media = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const updateViewport = () => setIsDesktop(media.matches);

    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, []);

  if (items.length === 0) return null;

  const isScrollable = isDesktop && sortedItems.length > NEWS_SCROLL_THRESHOLD;

  return (
    <section aria-labelledby="news-heading" className="home-section" id="news">
      <p className="section-label">News</p>
      <h2 id="news-heading">Latest updates</h2>
      <div
        aria-label={isScrollable ? "News updates" : undefined}
        className={`news-feed${isScrollable ? " news-feed--scrollable" : ""}`}
        role={isScrollable ? "region" : undefined}
        tabIndex={isScrollable ? 0 : undefined}
      >
        <ol>
          {sortedItems.map((item) => (
            <li className="news-item" key={`${item.date}-${item.title}`}>
              <time dateTime={item.date}>{item.date}</time>
              <div>
                <h3>
                  {item.href ? <a href={item.href}>{item.title}</a> : item.title}
                </h3>
                {item.description ? <p>{item.description}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
