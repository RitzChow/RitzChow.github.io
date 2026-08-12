import { profile } from "@/data/profile";
import { RoughMark } from "./rough-mark";

export function AboutSection() {
  return (
    <section aria-labelledby="about-heading" className="home-section about" id="about">
      <p className="section-label">About</p>
      <h1 id="about-heading">Understanding intelligence through the physical world.</h1>
      <div className="about__bio">
        <p>
          {profile.name} is an undergraduate researcher at {profile.institution},
          working on physical AI, physics reasoning, and multimodal evaluation.
        </p>
        <p>
          This work explores how AI systems perceive the physical world and{" "}
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
