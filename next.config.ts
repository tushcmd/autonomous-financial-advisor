import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compilerOptions: {
    // other options
    baseUrl: ".",
    paths: {
      "@/*": ["src/*"],
    },
  },
};

export default nextConfig;
