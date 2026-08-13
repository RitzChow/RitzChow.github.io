import type { Metadata } from "next";
import { PublicationArchive } from "@/components/publication-filter";
import { publications } from "@/data/publications";

export const metadata: Metadata = {
  title: "Publications — Ruizhe Zhou",
  description: "Research publications by Ruizhe Zhou in Physical AI, world models, and AI-generated text detection.",
};

export default function PublicationsPage() {
  return (
    <main className="publications-shell">
      <header className="publications-intro">
        <p className="section-eyebrow">Research archive</p>
        <h1>Publications</h1>
        <p>Selected work on intelligence grounded in physical systems and reliable language technologies.</p>
      </header>
      <PublicationArchive publications={publications} />
    </main>
  );
}
