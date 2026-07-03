import redisClient from "../configs/redis.js";
import asyncHandler from "express-async-handler";

/**
 * Middleware to cache GET endpoints using Redis
 * @param {number} ttl - Time-to-live in seconds (default: 300 seconds / 5 mins)
 */
export const cacheMiddleware = (ttl = 300) => {
  return asyncHandler(async (req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }

    if (!redisClient.isOpen) {
      console.warn("Redis client is disconnected. Bypassing cache to MongoDB.");
      return next();
    }

    const cacheKey = `cache:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        console.log(`⚡ Cache HIT for: ${cacheKey}`);
        return res.status(200).json(JSON.parse(cachedData));
      }

      console.log(`Cache MISS for: ${cacheKey}. Fetching from MongoDB...`);

      const originalJson = res.json;

      res.json = function (body) {
        // restoring the original behavior first so don't trap the request
        res.json = originalJson;

        // Save to Redis completely in the background without blocking the execution
        if (redisClient.isOpen) {
          redisClient
            .setEx(cacheKey, ttl, JSON.stringify(body))
            .then(() => console.log(`Successfully cached: ${cacheKey}`))
            .catch((err) =>
              console.error("Redis background save error:", err.message),
            );
        }

        // Instantly return the response to the user
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error(
        "Cache middleware failure, bypassing safely:",
        error.message,
      );
      next();
    }
  });
};
