import type { Publication, PublicationAuthor } from "@/data/types";
import { PaperFigure } from "./paper-figure";
import { PublicationActions } from "./publication-actions";

interface PublicationListProps {
  publications: Publication[];
}

export function sortPublicationsNewestFirst(items: Publication[]) {
  return items
    .map((publication, sourceIndex) => ({ publication, sourceIndex }))
    .sort((a, b) => b.publication.year - a.publication.year || a.sourceIndex - b.sourceIndex)
    .map(({ publication }) => publication);
}

function AuthorMark({ author }: { author: PublicationAuthor }) {
  return (
    <>
      {author.equalContribution ? (
        <sup className="publication-author-mark" aria-label="Equal contribution" title="Equal contribution">*</sup>
      ) : null}
      {author.correspondingAuthor ? (
        <sup className="publication-author-mark" aria-label="Corresponding author" title="Corresponding author">†</sup>
      ) : null}
    </>
  );
}

function Authors({ authors }: { authors: PublicationAuthor[] }) {
  return (
    <p className="publication-authors">
      {authors.map((author, index) => (
        <span key={`${author.name}-${index}`}>
          {author.name === "Ruizhe Zhou" ? (
            <strong className="publication-author--self">{author.name}</strong>
          ) : author.name}
          <AuthorMark author={author} />
          {index < authors.length - 1 ? ", " : ""}
        </span>
      ))}
    </p>
  );
}

export function PublicationList({ publications }: PublicationListProps) {
  return (
    <div className="publication-list">
      {sortPublicationsNewestFirst(publications).map((publication) => (
        <article className="publication-row" key={publication.id}>
          <PaperFigure
            title={publication.title}
            category={publication.category}
            image={publication.image}
            imageAlt={publication.imageAlt}
            pdfMedia={publication.pdfMedia}
          />
          <div className="publication-row__content">
            <p className="publication-kicker">
              {publication.year} · {publication.publicationType}
            </p>
            <h2>{publication.title}</h2>
            <Authors authors={publication.authors} />
            <p className="publication-venue">{publication.venue} · {publication.year}</p>
            {publication.award ? <p className="publication-award">{publication.award}</p> : null}
            {publication.tldr ? (
              <p className="publication-tldr"><span>TL;DR</span> {publication.tldr}</p>
            ) : null}
            <PublicationActions links={publication.links} bibtex={publication.bibtex} />
          </div>
        </article>
      ))}
    </div>
  );
}
