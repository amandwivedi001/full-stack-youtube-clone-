import { createClient } from "redis";

let redisAvailable = false;
let hasLoggedRedisDown = false;

export const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    socket: {
        reconnectStrategy: false,
    },
});

redisClient.on("ready", () => {
    redisAvailable = true;
    hasLoggedRedisDown = false;
    console.log("Redis connected");
});

redisClient.on("error", (err) => {
    redisAvailable = false;

    if (!hasLoggedRedisDown) {
        console.warn("Redis unavailable:", err.message);
        hasLoggedRedisDown = true;
    }
});

redisClient.on("end", () => {
    redisAvailable = false;

    if (!hasLoggedRedisDown) {
        console.warn("Redis connection closed");
        hasLoggedRedisDown = true;
    }
});

export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch {
        redisAvailable = false;

        if (!hasLoggedRedisDown) {
            console.warn("Redis connection failed. Continuing without cache.");
            hasLoggedRedisDown = true;
        }
    }
};

export const isRedisAvailable = () => {
    return redisAvailable && redisClient.isOpen;
};