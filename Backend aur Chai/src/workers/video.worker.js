import dotenv from "dotenv";
import { Worker } from "bullmq";
import { bullConnection } from "../queues/connection.js";
import connectDB from "../db/index.js";
import { Subscription } from "../models/subscription.model.js";
import { Notification } from "../models/notification.model.js";
import { processVideoPublished } from "./processors/videoPublished.processor.js";

dotenv.config({
    path: "./.env",
});

await connectDB();

const worker = new Worker(
    "video-processing",
    async (job) => {
        console.log(`[WORKER] Processing job ${job.id} - ${job.name}`);

        if (job.name === "video.published") {
            return processVideoPublished(job);
        }

        return {
            processed: false,
            reason: "Unknown job type",
        };
    },
    {
        connection: bullConnection,
        concurrency: 5,
    }
);

worker.on("completed", (job, result) => {
    console.log(`[WORKER] Job completed ${job.id}`, result);
});

worker.on("failed", (job, err) => {
    console.error(`[WORKER] Job failed ${job?.id}`, err.message);
});

console.log("[WORKER] Video worker started");