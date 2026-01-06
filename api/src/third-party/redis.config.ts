import RedisClient from "ioredis";
import { REDIS_HOST, REDIS_PORT } from "../configs/config";

export const redisClient = new RedisClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
    connectTimeout: 5000,
    retryStrategy(times) {
        return Math.min(times * 100, 2000)
    }
})

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err.message);
});

// queueing order to celery
export async function queueOrder(orderId: string) {
  await redisClient.lpush(
    "celery",
    JSON.stringify({ 
      task: "worker.tasks.process_order",
      args: [orderId],
      kwargs: {}
    }))
}