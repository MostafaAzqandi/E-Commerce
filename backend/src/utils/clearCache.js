import redisClient from "../configs/redis.js";

/**
 * Advanced Utility: Wipes out all cache keys matching a prefix (e.g., "cache:/api/v1/products*")
 */
export const clearCache = async (pattern) => {
  if (!redisClient.isOpen) return;

  try {
    let cursor = "0";

    do {
      const reply = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = reply.cursor;
      const keys = reply.keys;

      if (keys && keys.length > 0) {
        await redisClient.del(keys);
        console.log(`Bulk cleared keys: ${keys.join(", ")}`);
      }
    } while (cursor !== "0");
  } catch (error) {
    console.error("Bulk cache clearing failed:", error.message);
  }
};
