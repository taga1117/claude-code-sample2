import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/claude-code-sample2",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
