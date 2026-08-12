import type { NextConfig } from "next";

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserPagesRepository = repository.endsWith(".github.io");
const basePath = repository && !isUserPagesRepository ? `/${repository}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
