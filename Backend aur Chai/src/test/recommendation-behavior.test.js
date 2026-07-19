import { beforeEach, describe, expect, it, vi } from "vitest";
import { callController } from "./testUtils.js";

vi.mock("../models/video.model.js", () => ({
    Video: {
        findById: vi.fn(),
        aggregate: vi.fn(),
    },
}));

vi.mock("../models/user.model.js", () => ({
    User: {},
}));

vi.mock("../utils/cloudinary.js", () => ({
    uploadOnCloudinary: vi.fn(),
    deleteFromCloudinary: vi.fn(),
}));

vi.mock("../utils/cache.js", () => ({
    getCache: vi.fn(),
    setCache: vi.fn(),
    deleteCacheByPattern: vi.fn(),
}));

vi.mock("../queues/video.queue.js", () => ({
    addVideoPublishedJob: vi.fn(),
}));

import { Video } from "../models/video.model.js";
import { getCache, setCache } from "../utils/cache.js";
import { getRecommendedVideos } from "../controllers/video.controller.js";

describe("Recommendation behavior", () => {
    const videoId = "507f1f77bcf86cd799439011";
    const ownerId = "507f1f77bcf86cd799439012";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("excludes current video, filters published videos, and caches result", async () => {
        getCache.mockResolvedValue(null);

        Video.findById.mockReturnValue({
            lean: vi.fn().mockResolvedValue({
                _id: videoId,
                owner: ownerId,
                title: "React Node Project",
                description: "Full stack video platform",
            }),
        });

        Video.aggregate.mockResolvedValue([]);

        const { body, error } = await callController(getRecommendedVideos, {
            params: { videoId },
            query: { limit: "8" },
        });

        expect(error).toBeUndefined();

        expect(Video.aggregate).toHaveBeenCalled();

        const pipeline = Video.aggregate.mock.calls[0][0];

        expect(pipeline[0].$match._id).toBeDefined();
        expect(pipeline[0].$match.isPublished).toBe(true);

        expect(JSON.stringify(pipeline[0].$match)).toContain("$ne");

        expect(setCache).toHaveBeenCalledWith(
            `recommendations:${videoId}:limit=8`,
            [],
            300
        );

        expect(body.success).toBe(true);
    });

    it("returns cached recommendations when cache exists", async () => {
        const cachedVideos = [
            {
                _id: "507f1f77bcf86cd799439013",
                title: "Cached recommendation",
            },
        ];

        getCache.mockResolvedValue(cachedVideos);

        const { body, error } = await callController(getRecommendedVideos, {
            params: { videoId },
            query: { limit: "8" },
        });

        expect(error).toBeUndefined();

        expect(Video.findById).not.toHaveBeenCalled();
        expect(Video.aggregate).not.toHaveBeenCalled();

        expect(body.data).toEqual(cachedVideos);
        expect(body.success).toBe(true);
    });
});