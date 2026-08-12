"use client";

import { useEffect, useRef, useState } from "react";
import { news } from "@/data/news";
import type { NewsItem } from "@/data/types";
import { sortNews } from "@/lib/content";

type NewsSectionProps = {
  items?: readonly NewsItem[];
};

const DESKTOP_MEDIA_QUERY = "(min-width: 761px)";

export function NewsSection({ items = news }: NewsSectionProps) {
  const sortedItems = sortNews(items);
  const feedRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const feed = feedRef.current;
    if (!feed) return;

    const media = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const measureOverflow = () => {
      setIsScrollable(media.matches && feed.scrollHeight > feed.clientHeight);
    };
    const observer =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(measureOverflow)
        : null;

    measureOverflow();
    observer?.observe(feed);
    window.addEventListener("resize", measureOverflow);
    media.addEventListener("change", measureOverflow);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measureOverflow);
      media.removeEventListener("change", measureOverflow);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="news-heading" className="home-section" id="news">
      <p className="section-label">News</p>
      <h2 id="news-heading">Latest updates</h2>
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
