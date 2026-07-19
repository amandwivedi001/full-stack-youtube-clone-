import { beforeEach, describe, expect, it, vi } from "vitest";
import { callController } from "./testUtils.js";

vi.mock("../models/video.model.js", () => ({
    Video: {
        findById: vi.fn(),
        findByIdAndUpdate: vi.fn(),
        findByIdAndDelete: vi.fn(),
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
import {
    updateVideo,
    deleteVideo,
    togglePublishStatus,
} from "../controllers/video.controller.js";

describe("Video ownership", () => {
    const ownerId = "507f1f77bcf86cd799439011";
    const otherUserId = "507f1f77bcf86cd799439012";
    const videoId = "507f1f77bcf86cd799439013";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("rejects video update by non-owner", async () => {
        Video.findById.mockResolvedValue({
            _id: videoId,
            owner: ownerId,
        });

        const { error } = await callController(updateVideo, {
            params: { videoId },
            body: { title: "Updated title" },
            user: { _id: otherUserId },
        });

        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("You are not allowed to update this video");
        expect(Video.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("rejects video delete by non-owner", async () => {
        Video.findById.mockResolvedValue({
            _id: videoId,
            owner: ownerId,
        });

        const { error } = await callController(deleteVideo, {
            params: { videoId },
            user: { _id: otherUserId },
        });

        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("You are not allowed to delete this video");
        expect(Video.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it("rejects publish toggle by non-owner", async () => {
        const save = vi.fn();

        Video.findById.mockResolvedValue({
            _id: videoId,
            owner: ownerId,
            isPublished: true,
            save,
        });

        const { error } = await callController(togglePublishStatus, {
            params: { videoId },
            user: { _id: otherUserId },
        });

        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("You are not allowed to update this video");
        expect(save).not.toHaveBeenCalled();
    });
});