import { experience } from "@/data/experience";
import type { Experience } from "@/data/types";

type ExperienceSectionProps = {
  items?: readonly Experience[];
};

export function ExperienceSection({ items = experience }: ExperienceSectionProps) {
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="experience-heading"
      className="home-section"
      id="experience"
    >
      <p className="section-label">Experience</p>
      <h2 id="experience-heading">Academic experience</h2>
      <ol className="timeline">
        {items.map((item) => (
          <li className="timeline__item" key={`${item.role}-${item.institution}`}>
            <div>
              <h3>{item.role}</h3>
              <p className="timeline__institution">{item.institution}</p>
              {item.lab || item.advisor || item.project ? (
                <dl className="timeline__details">
                  {item.lab ? <><dt>Lab</dt><dd>{item.lab}</dd></> : null}
                  {item.advisor ? <><dt>Advisor</dt><dd>{item.advisor}</dd></> : null}
                  {item.project ? <><dt>Project</dt><dd>{item.project}</dd></> : null}
                </dl>
              ) : null}
              {item.description ? <p>{item.description}</p> : null}
            </div>
            {item.displayDate ? <p className="timeline__date">{item.displayDate}</p> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
