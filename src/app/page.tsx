import { AboutSection } from "@/components/about-section";
import { ExperienceSection } from "@/components/experience-section";
import { IdentityRail } from "@/components/identity-rail";
import { NewsSection } from "@/components/news-section";
import { ResearchSection } from "@/components/research-section";
import { profile } from "@/data/profile";

export default function Page() {
  return (
    <main className="home-shell">
      <div className="home-grid">
        <div className="home-content">
          <AboutSection />
          <NewsSection />
          <ResearchSection />
          <ExperienceSection />
        </div>
        <IdentityRail profile={profile} />
      </div>
    </main>
  );
}
