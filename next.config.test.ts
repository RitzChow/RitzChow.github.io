import { describe, expect, it } from "vitest";
import { getGithubPagesBasePath } from "./next.config";

describe("getGithubPagesBasePath", () => {
  it("does not set a base path outside GitHub Actions", () => {
    expect(
      getGithubPagesBasePath({
        GITHUB_ACTIONS: undefined,
        GITHUB_REPOSITORY: "owner/project",
      }),
    ).toBe("");
  });

  it("does not set a base path for a user Pages repository", () => {
    expect(
      getGithubPagesBasePath({
        GITHUB_ACTIONS: "true",
        GITHUB_REPOSITORY: "owner/owner.github.io",
      }),
    ).toBe("");
  });

  it("sets the repository base path for project Pages in GitHub Actions", () => {
    expect(
      getGithubPagesBasePath({
        GITHUB_ACTIONS: "true",
        GITHUB_REPOSITORY: "owner/project",
      }),
    ).toBe("/project");
  });
});
