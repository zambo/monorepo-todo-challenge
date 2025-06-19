// @ts-check

const nextConfig: import("next").NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  turbopack: {},
  transpilePackages: [
    "@repo/ui",
    "@repo/shared",
    "@repo/stores",
    "@repo/utils",
    "@repo/config",
  ],
  output: "standalone",
};

module.exports = nextConfig;
