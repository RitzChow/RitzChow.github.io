"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { news } from "@/data/news";
import type { NewsItem } from "@/data/types";
import { sortNews } from "@/lib/content";

type NewsSectionProps = {
  items?: readonly NewsItem[];
};

export function NewsSection({ items = news }: NewsSectionProps) {
  const sortedItems = sortNews(items);
  const feedRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const firstItemRef = useRef<HTMLLIElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useLayoutEffect(() => {
    const feed = feedRef.current;
    const list = listRef.current;
    const firstItem = firstItemRef.current;
    if (!feed || !list || !firstItem) return;

    const measureViewport = () => {
      const firstItemHeight = firstItem.getBoundingClientRect().height;
      if (firstItemHeight > 0) {
        feed.style.blockSize = `${firstItemHeight}px`;
      }
      setIsScrollable(feed.scrollHeight > feed.clientHeight);
    };
    const observer =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(measureViewport)
        : null;

    measureViewport();
    observer?.observe(feed);
    observer?.observe(list);
    observer?.observe(firstItem);
    window.addEventListener("resize", measureViewport);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measureViewport);
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
        <ol ref={listRef}>
          {sortedItems.map((item, index) => (
            <li
              className="news-item"
              key={`${item.date}-${item.title}`}
              ref={index === 0 ? firstItemRef : undefined}
            >
              <time dateTime={item.date}>{item.date}</time>
              <p>{item.description ?? item.title}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
