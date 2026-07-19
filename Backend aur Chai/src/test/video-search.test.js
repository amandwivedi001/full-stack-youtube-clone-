import { beforeEach, describe, expect, it, vi } from "vitest";
import { callController } from "./testUtils.js";

vi.mock("../models/video.model.js", () => ({
    Video: {
        aggregate: vi.fn(),
    },
}));

vi.mock("../models/user.model.js", () => ({
    User: {},
}));

vi.mock("../utils/cache.js", () => ({
    getCache: vi.fn(),
    setCache: vi.fn(),
    deleteCacheByPattern: vi.fn(),
}));

vi.mock("../queues/video.queue.js", () => ({
    addVideoPublishedJob: vi.fn(),
}));

vi.mock("../utils/cloudinary.js", () => ({
    uploadOnCloudinary: vi.fn(),
    deleteFromCloudinary: vi.fn(),
}));

import { Video } from "../models/video.model.js";
import { getCache, setCache } from "../utils/cache.js";
import { getAllVideos } from "../controllers/video.controller.js";

describe("Video search behavior", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("uses search query in aggregation pipeline", async () => {
        getCache.mockResolvedValue(null);

        const aggregateResult = [{ fakePipeline: true }];
        Video.aggregate.mockReturnValue(aggregateResult);

        const { body, error } = await callController(getAllVideos, {
            query: {
                query: "react",
                page: "1",
                limit: "10",
                sortBy: "createdAt",
                sortType: "desc",
            },
        });

        expect(error).toBeUndefined();

        expect(Video.aggregate).toHaveBeenCalled();

        const pipeline = Video.aggregate.mock.calls[0][0];

        expect(pipeline[0]).toEqual({
            $match: {
                isPublished: true,
                $or: [
                    { title: { $regex: "react", $options: "i" } },
                    { description: { $regex: "react", $options: "i" } },
                ],
            },
        });

        expect(JSON.stringify(pipeline)).toContain("react");

        expect(setCache).toHaveBeenCalled();
        expect(body.success).toBe(true);
    });
});