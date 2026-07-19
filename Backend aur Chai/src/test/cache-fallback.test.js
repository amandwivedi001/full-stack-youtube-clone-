import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../db/redis.js", () => ({
    redisClient: {
        get: vi.fn(),
        setEx: vi.fn(),
        scan: vi.fn(),
        del: vi.fn(),
    },
    isRedisAvailable: vi.fn(),
}));

import { redisClient, isRedisAvailable } from "../db/redis.js";
import {
    getCache,
    setCache,
    deleteCacheByPattern,
} from "../utils/cache.js";

describe("Cache fallback behavior", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns null when Redis is unavailable during cache read", async () => {
        isRedisAvailable.mockReturnValue(false);

        const result = await getCache("videos:home");

        expect(result).toBeNull();
        expect(redisClient.get).not.toHaveBeenCalled();
    });

    it("skips cache write when Redis is unavailable", async () => {
        isRedisAvailable.mockReturnValue(false);

        await setCache("videos:home", [{ title: "Test Video" }], 60);

        expect(redisClient.setEx).not.toHaveBeenCalled();
    });

    it("skips cache invalidation when Redis is unavailable", async () => {
        isRedisAvailable.mockReturnValue(false);

        await deleteCacheByPattern("videos:*");

        expect(redisClient.scan).not.toHaveBeenCalled();
        expect(redisClient.del).not.toHaveBeenCalled();
    });

    it("returns null when cached JSON is invalid instead of crashing", async () => {
        isRedisAvailable.mockReturnValue(true);
        redisClient.get.mockResolvedValue("{invalid-json");

        const result = await getCache("videos:broken");

        expect(result).toBeNull();
    });
});