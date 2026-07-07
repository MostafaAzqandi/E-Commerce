import redisClient from "../configs/redis.js";
import asyncHandler from "express-async-handler";

export const rateLimiterMiddleware = (
  ttl = 10,
  maxRequestLimit = 5,
  prefix = "global",
) => {
  return asyncHandler(async (req, res, next) => {
    try {
      const userIp = req.ip.startsWith("::ffff:")
        ? req.ip.split("::ffff:")[1]
        : req.ip;
      const rateLimitKey = `rate-limit-${prefix}:${userIp}`;
      const currentCount = await redisClient.incr(rateLimitKey);
      if (currentCount === 1) {
        console.log(`Ratelimit key created: ${rateLimitKey}`);
        await redisClient.expire(rateLimitKey, ttl);
      }
      if (currentCount > maxRequestLimit) {
        return res
          .status(429)
          .json({ message: "Too many requests, Please try again later" });
      }
      next();
    } catch (error) {
      console.log("An error accurred while ratelimiting process: ", error);
      next();
    }
  });
};
