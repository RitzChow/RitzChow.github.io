import { profile } from "@/data/profile";
import type { Profile } from "@/data/types";
import { RoughMark } from "./rough-mark";

type AboutSectionProps = {
  data?: Profile;
};

export function AboutSection({ data = profile }: AboutSectionProps) {
  return (
    <section aria-labelledby="about-heading" className="home-section about" id="about">
      <h2 className="section-label" id="about-heading">
        About
      </h2>
      <div className="about__bio">
        <p>
          {data.bio} The central question is how AI systems{" "}
          <span className="rough-phrase">
            reason about physics
            <RoughMark className="rough-phrase__mark" variant="underline" />
          </span>
          .
        </p>
      </div>
    </section>
  );
}
