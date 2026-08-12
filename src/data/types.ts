export interface ContactLink {
  label: string;
  href?: string;
}

export interface Profile {
  name: string;
  role: string;
  institution: string;
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

export interface Experience {
  role: string;
  institution: string;
  displayDate?: string;
  lab?: string;
  advisor?: string;
  project?: string;
  description?: string;
}

export interface NewsItem {
  date: string;
  title: string;
  description?: string;
  href?: string;
}

export interface PublicationLinks {
  paper?: string;
  code?: string;
  project?: string;
  openreview?: string;
  demo?: string;
  video?: string;
  slides?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
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
  links: PublicationLinks;
}
