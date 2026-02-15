import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactCompiler: isProduction,
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ["http://127.0.0.1:3000"],
  compress: true,
  productionBrowserSourceMaps: false,
  output: "export",
  compiler: {},
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "@tanstack/react-query",
      "@base-ui/react",
      "recharts",
    ],
  },
  images: {
    unoptimized: true,
  },

  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
