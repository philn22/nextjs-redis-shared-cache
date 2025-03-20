import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: "standalone",

  cacheHandler: require.resolve("./cache-handler.mjs"),
  cacheMaxMemorySize: 0, // disable default in-memory caching
  env: {
    NEXT_PUBLIC_REDIS_INSIGHT_URL:
      process.env.REDIS_INSIGHT_URL ?? "http://localhost:8001",
  },
};

export default nextConfig;
