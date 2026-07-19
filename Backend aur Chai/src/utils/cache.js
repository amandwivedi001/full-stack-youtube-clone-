import { redisClient, isRedisAvailable } from "../db/redis.js";

const shouldLogCache = process.env.CACHE_DEBUG === "true";

const logCache = (message) => {
    if (shouldLogCache) {
        console.log(message);
    }
};

export const getCache = async (key) => {
    try {
        if (!isRedisAvailable()) {
            logCache(`[CACHE SKIPPED] Redis unavailable key=${key}`);
            return null;
        }

        const cached = await redisClient.get(key);

        if (!cached) {
            logCache(`[CACHE MISS] ${key}`);
            return null;
        }

        logCache(`[CACHE HIT] ${key}`);
        return JSON.parse(cached);
    } catch (error) {
        console.warn("[CACHE READ FAILED]", error.message);
        return null;
    }
};

export const setCache = async (key, value, ttlSeconds = 60) => {
    try {
        if (!isRedisAvailable()) {
            logCache(`[CACHE SET SKIPPED] Redis unavailable key=${key}`);
            return;
        }

        await redisClient.setEx(
            key,
            ttlSeconds,
            JSON.stringify(value)
        );

        logCache(`[CACHE SET] ${key} ttl=${ttlSeconds}s`);
    } catch (error) {
        console.warn("[CACHE WRITE FAILED]", error.message);
    }
};

export const deleteCacheByPattern = async (pattern) => {
    try {
        if (!isRedisAvailable()) {
            logCache(`[CACHE INVALIDATION SKIPPED] Redis unavailable pattern=${pattern}`);
            return;
        }

        let cursor = "0";
        let deletedCount = 0;

        do {
            const result = await redisClient.scan(cursor, {
                MATCH: pattern,
                COUNT: 100,
            });

            cursor = result.cursor;

            const keys = result.keys || [];

            if (keys.length > 0) {
                await redisClient.del(keys);
                deletedCount += keys.length;
            }
        } while (cursor !== "0");

        logCache(`[CACHE INVALIDATED] pattern=${pattern} count=${deletedCount}`);
    } catch (error) {
        console.warn("[CACHE INVALIDATION FAILED]", error.message);
    }
};