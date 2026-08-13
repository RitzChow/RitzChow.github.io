import { InstitutionRow } from "@/components/institution-row";
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
      <h2 className="section-label" id="experience-heading">Experience</h2>
      <ol className="institution-list">
        {items.map((item) => (
          <InstitutionRow item={item} key={`${item.role}-${item.institution}`} />
        ))}
      </ol>
    </section>
  );
}
