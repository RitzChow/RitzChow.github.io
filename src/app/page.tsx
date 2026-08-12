import { AboutSection } from "@/components/about-section";
import { ExperienceSection } from "@/components/experience-section";
import { NewsSection } from "@/components/news-section";
import { ResearchSection } from "@/components/research-section";

export default function Page() {
  return (
    <main className="home-shell">
      <div className="home-grid">
        <div className="home-content">
          <AboutSection />
          <ResearchSection />
          <ExperienceSection />
          <NewsSection />
        </div>
      </div>
    </main>
  );
}
