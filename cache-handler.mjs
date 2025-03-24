import { CacheHandler } from "@neshca/cache-handler";
import { createClient } from "redis";
import createLruHandler from "@neshca/cache-handler/local-lru";
import createRedisHandler from "@neshca/cache-handler/redis-stack";

const { REVALIDATE_TIME } = process.env;

CacheHandler.onCreation(async () => {
  let client;

  try {
    client = createClient({
      url: process.env.REDIS_URL ?? "redis://localhost:6379",
    });

    client.on("error", () => {});
  } catch (error) {
    console.warn("Failed to create Redis client:", error);
  }

  if (client) {
    try {
      console.info("Connecting Redis client...");
      await client.connect();
      console.info("Redis client connected.");
    } catch (error) {
      console.warn("Failed to connect Redis client:", error);

      console.warn("Disconnecting the Redis client...");
      client
        .disconnect()
        .then(() => {
          console.info("Redis client disconnected.");
        })
        .catch(() => {
          console.warn(
            "Failed to quit the Redis client after failing to connect."
          );
        });
    }
  }

  /** @type {import("@neshca/cache-handler").Handler | null} */
  let handler;

  if (client?.isReady) {
    handler = await createRedisHandler({
      client,
      keyPrefix: "prefix:", // Do not use a dynamic and unique prefix for each Next.js build because it will create unique cache data for each instance of Next.js, and the cache will not be shared.
      timeoutMs: 1000,
    });
  }
  // Fallback to LRU handler if Redis client is not available.
  // The application will still work, but the cache will be in memory only and not shared.
  const lruHandler = createLruHandler();
  console.warn(
    "Falling back to LRU handler because Redis client is not available."
  );

  return {
    handlers: [handler, lruHandler],
    ttl: {
      defaultStaleAge: parseInt(REVALIDATE_TIME) ?? 60,
      estimateExpireAge: (staleAge) => staleAge,
    },
  };
});

export default CacheHandler;
