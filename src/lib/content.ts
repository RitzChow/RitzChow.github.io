export const normalizeContactHref = (href: string): string => {
  const trimmedHref = href.trim();

  if (/^(https?:\/\/|mailto:)/i.test(trimmedHref)) {
    return trimmedHref;
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedHref)) {
    return `mailto:${trimmedHref}`;
  }

  return "";
};

export const definedLinks = <T extends { href?: string }>(
  links: readonly T[],
): Array<T & { href: string }> =>
  links.filter((link): link is T & { href: string } =>
    Boolean(link.href?.trim()),
  );

export const sortNews = <T extends { date: string }>(items: readonly T[]): T[] =>
  [...items].sort((a, b) => b.date.localeCompare(a.date));

export const sortPublications = <T extends { year: number }>(
  items: readonly T[],
): T[] =>
  items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => b.item.year - a.item.year || a.index - b.index)
    .map(({ item }) => item);
