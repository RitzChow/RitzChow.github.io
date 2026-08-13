import { RoughMark } from "./rough-mark";

export function AboutSection() {
  return (
    <section aria-labelledby="about-heading" className="home-section about" id="about">
      <h2 className="section-label" id="about-heading">
        About
      </h2>
      <div className="about__bio">
        <p>
          I am an undergraduate student at Sun Yat-sen University, supervised by{" "}
          <a href="https://scholar.google.com/citations?user=voxznZAAAAAJ&hl=zh-CN" rel="noreferrer" target="_blank">
            Prof. Xiaodan Liang
          </a>
          . I have also had the privilege of receiving guidance from{" "}
          <a href="https://scholar.google.com/citations?user=cnncomYAAAAJ&hl=zh-CN" rel="noreferrer" target="_blank">
            Prof. Pengtao Xie
          </a>{" "}
          (@UCSD) and{" "}
          <a href="https://scholar.google.com/citations?hl=zh-CN&user=Bii0w1oAAAAJ" rel="noreferrer" target="_blank">
            Prof. Xiaoming Liu
          </a>{" "}
          (@UNC Chapel Hill).
        </p>
        <p>
          My research interests primarily lie in physical intelligence and visual intelligence,
          including spatial understanding and reasoning, diffusion VLMs, and more.
        </p>
        <p>
          I am currently seeking{" "}
          <span className="rough-phrase">
            <strong>PhD/MS opportunities</strong>
            <RoughMark className="rough-phrase__mark" variant="underline" />
          </span>{" "}
          for Fall 2027.
        </p>
      </div>
    </section>
  );
}
