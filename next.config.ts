import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: "standalone",
  cacheHandler: require.resolve("./cache-handler.local.mjs"),
  cacheMaxMemorySize: 0, // disable default in-memory caching
  // env: {
  //   NEXT_PUBLIC_REDIS_INSIGHT_URL:
  //     process.env.REDIS_INSIGHT_URL ?? "http://localhost:8001",
  // },
};

export default nextConfig;
