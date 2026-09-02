import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  allowedDevOrigins: ["172.20.10.3"],
};

export default nextConfig;
