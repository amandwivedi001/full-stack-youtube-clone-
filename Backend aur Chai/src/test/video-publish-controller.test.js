import { beforeEach, describe, expect, it, vi } from "vitest";
import { callController } from "./testUtils.js";

vi.mock("../utils/cloudinary.js", () => ({
    uploadOnCloudinary: vi.fn(),
}));

vi.mock("../models/video.model.js", () => ({
    Video: {
        create: vi.fn(),
    },
}));

vi.mock("../utils/cache.js", () => ({
    deleteCacheByPattern: vi.fn(),
    getCache: vi.fn(),
    setCache: vi.fn(),
}));

vi.mock("../queues/video.queue.js", () => ({
    addVideoPublishedJob: vi.fn(),
}));

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { deleteCacheByPattern } from "../utils/cache.js";
import { addVideoPublishedJob } from "../queues/video.queue.js";
import { publishAVideo } from "../controllers/video.controller.js";

describe("Video publish controller", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("creates video, invalidates cache, and enqueues notification job", async () => {
        const ownerId = "507f1f77bcf86cd799439011";

        const createdVideo = {
            _id: "507f1f77bcf86cd799439012",
            title: "Controller Queue Test",
            owner: ownerId,
            videoFile: "https://cloudinary.com/video.mp4",
            thumbnail: "https://cloudinary.com/thumb.jpg",
        };

        uploadOnCloudinary
            .mockResolvedValueOnce({
                url: "https://cloudinary.com/video.mp4",
                duration: 120,
            })
            .mockResolvedValueOnce({
                url: "https://cloudinary.com/thumb.jpg",
            });

        Video.create.mockResolvedValue(createdVideo);

        const { res, body, error } = await callController(publishAVideo, {
            body: {
                title: "Controller Queue Test",
                description: "Testing publish controller",
            },
            files: {
                videoFile: [
                    {
                        path: "local-video-path.mp4",
                    },
                ],
                thumbnail: [
                    {
                        path: "local-thumbnail-path.jpg",
                    },
                ],
            },
            user: {
                _id: ownerId,
            },
        });

        expect(error).toBeUndefined();

        expect(Video.create).toHaveBeenCalledWith({
            title: "Controller Queue Test",
            description: "Testing publish controller",
            videoFile: "https://cloudinary.com/video.mp4",
            thumbnail: "https://cloudinary.com/thumb.jpg",
            duration: 120,
            owner: ownerId,
        });

        expect(deleteCacheByPattern).toHaveBeenCalledWith("videos:*");
        expect(deleteCacheByPattern).toHaveBeenCalledWith("recommendations:*");
        expect(addVideoPublishedJob).toHaveBeenCalledWith(createdVideo);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(body.success).toBe(true);
    });
});