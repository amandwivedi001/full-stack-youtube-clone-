import { Queue } from "bullmq";
import { bullConnection } from "./connection.js";

export const videoQueue = new Queue("video-processing", {
    connection: bullConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000,
        },
        removeOnComplete: {
            age: 60 * 60,
            count: 1000,
        },
        removeOnFail: {
            age: 24 * 60 * 60,
        },
    },
});

export const addVideoPublishedJob = async (video) => {
    if (process.env.ENABLE_VIDEO_WORKER !== "true") {
        console.log("[QUEUE SKIPPED] ENABLE_VIDEO_WORKER is not true");
        return null;
    }

    return videoQueue.add("video.published", {
        videoId: video._id.toString(),
        ownerId: video.owner.toString(),
        title: video.title,
        createdAt: video.createdAt,
    });
};