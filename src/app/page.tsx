import { AboutSection } from "@/components/about-section";
import { EducationSection } from "@/components/education-section";
import { ExperienceSection } from "@/components/experience-section";
import { IdentityRail } from "@/components/identity-rail";
import { NewsSection } from "@/components/news-section";
import { profile } from "@/data/profile";

export default function Page() {
  return (
    <main className="home-shell">
      <div className="home-grid">
        <IdentityRail profile={profile} />
        <div className="home-content">
          <AboutSection />
          <NewsSection />
          <div className="education-experience-grid">
            <EducationSection />
            <ExperienceSection />
          </div>
        </div>
      </div>
    </main>
  );
}
