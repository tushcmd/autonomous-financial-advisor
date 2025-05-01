import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Keep any other valid config options here (not compilerOptions!)
  serverExternalPackages: ["@mastra/*"],
};

export default nextConfig;
