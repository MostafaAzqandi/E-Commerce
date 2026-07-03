import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      // If it has tried more than 3 times, stop trying entirely
      if (retries > 3) {
        console.error(
          "Redis max reconnect retries reached. Stopping reconnection attempts.",
        );
        return false; // Returning false tells Redis to stop trying completely
      }

      // Otherwise, wait 2 seconds before trying again
      console.log(`Redis reconnecting... Attempt #${retries}`);
      return 2000;
    },
  },
});

redisClient.on("error", (err) =>
  console.error("Redis Client Error:", err.message),
);
redisClient.on("connect", () =>
  console.log("Redis Server connected successfully."),
);

export default redisClient;
