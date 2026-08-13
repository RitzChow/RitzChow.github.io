"use client";

import { useEffect, useRef, useState } from "react";
import { news } from "@/data/news";
import type { NewsItem } from "@/data/types";
import { sortNews } from "@/lib/content";

type NewsSectionProps = {
  items?: readonly NewsItem[];
};

export function NewsSection({ items = news }: NewsSectionProps) {
  const sortedItems = sortNews(items);
  const feedRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;

    const measureOverflow = () => {
      setIsScrollable(feed.scrollHeight > feed.clientHeight);
    };
    const observer =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(measureOverflow)
        : null;

    measureOverflow();
    observer?.observe(feed);
    window.addEventListener("resize", measureOverflow);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measureOverflow);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="news-heading" className="home-section" id="news">
      <h2 className="section-label" id="news-heading">
        News
      </h2>
      <div
        aria-label={isScrollable ? "News updates" : undefined}
        className="news-feed"
        ref={feedRef}
        role={isScrollable ? "region" : undefined}
        tabIndex={isScrollable ? 0 : undefined}
      >
        <ol>
          {sortedItems.map((item) => (
            <li className="news-item" key={`${item.date}-${item.title}`}>
              <time dateTime={item.date}>{item.date}</time>
              <p>{item.description ?? item.title}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
