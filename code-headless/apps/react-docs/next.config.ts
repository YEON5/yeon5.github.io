import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@code-headless/react-ui"],
  turbopack: {
    resolveAlias: {
      "react-ui": "@code-headless/react-ui",
    },
  },
};

export default nextConfig;
