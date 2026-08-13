import type { InstitutionEntry } from "@/data/types";
import { sitePath } from "@/lib/site-path";

type InstitutionRowProps = {
  item: InstitutionEntry;
};

export function InstitutionRow({ item }: InstitutionRowProps) {
  const hasDetails = Boolean(item.lab || item.advisor || item.project);

  return (
    <li className="institution-row">
      {/* Institution assets are served verbatim so their official SVG/GIF formats are preserved. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={item.logoAlt}
        className="institution-row__logo"
        src={sitePath(item.logo)}
      />
      <div className="institution-row__content">
        <h3>{item.institution}</h3>
        <p className="institution-row__role">{item.role}</p>
        {hasDetails ? (
          <dl className="institution-row__details">
            {item.lab ? <><dt>Lab</dt><dd>{item.lab}</dd></> : null}
            {item.advisor ? <><dt>Advisor</dt><dd>{item.advisor}</dd></> : null}
            {item.project ? <><dt>Project</dt><dd>{item.project}</dd></> : null}
          </dl>
        ) : null}
        {item.description ? <p>{item.description}</p> : null}
      </div>
      {item.displayDate ? <p className="institution-row__date">{item.displayDate}</p> : null}
    </li>
  );
}
