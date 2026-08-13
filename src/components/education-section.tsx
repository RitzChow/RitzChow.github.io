import { InstitutionRow } from "@/components/institution-row";
import { education } from "@/data/education";
import type { Education } from "@/data/types";

type EducationSectionProps = {
  items?: readonly Education[];
};

export function EducationSection({ items = education }: EducationSectionProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="education-heading" className="home-section" id="education">
      <h2 className="section-label" id="education-heading">Education</h2>
      <ol className="institution-list">
        {items.map((item) => (
          <InstitutionRow item={item} key={`${item.role}-${item.institution}`} />
        ))}
      </ol>
    </section>
  );
}
