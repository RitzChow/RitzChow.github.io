import { news } from "@/data/news";
import type { NewsItem } from "@/data/types";
import { sortNews } from "@/lib/content";

type NewsSectionProps = {
  items?: readonly NewsItem[];
};

export function NewsSection({ items = news }: NewsSectionProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="news-heading" className="home-section" id="news">
      <p className="section-label">News</p>
      <h2 id="news-heading">Latest updates</h2>
      <div aria-label="News updates" className="news-feed" role="region" tabIndex={0}>
        <ol>
          {sortNews(items).map((item) => (
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
