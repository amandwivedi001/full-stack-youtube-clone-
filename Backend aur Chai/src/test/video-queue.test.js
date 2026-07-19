import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../queues/video.queue.js", () => ({
    videoQueue: {
        add: vi.fn(),
    },
}));

import { videoQueue } from "../queues/video.queue.js";

const addVideoPublishedJob = async (video) => {
    await videoQueue.add(
        "video.published",
        {
            videoId: video._id,
            ownerId: video.owner,
            title: video.title,
        },
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        }
    );
};

describe("Video queue behavior", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("adds a video.published job with required payload", async () => {
        const video = {
            _id: "507f1f77bcf86cd799439011",
            owner: "507f1f77bcf86cd799439012",
            title: "Queue Test Video",
        };

        await addVideoPublishedJob(video);

        expect(videoQueue.add).toHaveBeenCalledWith(
            "video.published",
            {
                videoId: video._id,
                ownerId: video.owner,
                title: video.title,
            },
            {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 5000,
                },
                removeOnComplete: true,
                removeOnFail: false,
            }
        );
    });
});