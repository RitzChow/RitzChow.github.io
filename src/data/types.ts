export interface ContactLink {
  label: string;
  href?: string;
}

export interface Profile {
  name: string;
  role?: string;
  institution?: string;
  bio: string;
  portrait?: string;
  cv?: string;
  wechatQr?: string;
  contacts: ContactLink[];
}

export interface ResearchInterest {
  title: string;
  description: string;
}

export interface InstitutionEntry {
  role: string;
  institution: string;
  logo: string;
  logoAlt: string;
  displayDate?: string;
  supervisor?: string;
  supervisorUrl?: string;
  lab?: string;
  advisor?: string;
  project?: string;
  description?: string;
}

export type Education = InstitutionEntry;
export type Experience = InstitutionEntry;

export interface NewsItem {
  date: string;
  title: string;
  description?: string;
  href?: string;
}

export interface PublicationLinks {
  paper?: string;
  scholar?: string;
  code?: string;
  project?: string;
  openreview?: string;
  demo?: string;
  video?: string;
  slides?: string;
}

export interface PublicationAuthor {
  name: string;
  equalContribution?: boolean;
  correspondingAuthor?: boolean;
}

export type PublicationFilterGroup = "physical" | "visual";

export interface Publication {
  id: string;
  title: string;
  authors: PublicationAuthor[];
  year: number;
  publicationType: string;
  venue: string;
  category: string;
  arxivId?: string;
  image?: string;
  imageAlt?: string;
  tldr?: string;
  award?: string;
  bibtex?: string;
  featured?: boolean;
  filterGroups?: PublicationFilterGroup[];
  links: PublicationLinks;
}
