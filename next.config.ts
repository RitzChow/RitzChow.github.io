import type { NextConfig } from "next";

interface GithubPagesEnvironment {
  GITHUB_ACTIONS?: string;
  GITHUB_REPOSITORY?: string;
}

export function getGithubPagesBasePath(environment: GithubPagesEnvironment) {
  if (environment.GITHUB_ACTIONS !== "true") return "";

  const repository = environment.GITHUB_REPOSITORY?.split("/")[1] ?? "";
  return repository && !repository.endsWith(".github.io") ? `/${repository}` : "";
}

const basePath = getGithubPagesBasePath({
  GITHUB_ACTIONS: process.env.GITHUB_ACTIONS,
  GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
});

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
