import { researchInterests } from "@/data/research";
import type { ResearchInterest } from "@/data/types";

type ResearchSectionProps = {
  items?: readonly ResearchInterest[];
};

export function ResearchSection({ items = researchInterests }: ResearchSectionProps) {
  return (
    <section
      aria-labelledby="research-heading"
      className="home-section"
      id="research"
    >
      <p className="section-label">Research</p>
      <h2 id="research-heading">Research interests</h2>
      <ol className="editorial-list">
        {items.map((item, index) => (
          <li className="editorial-row" key={item.title}>
            <span aria-hidden="true" className="editorial-row__number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
