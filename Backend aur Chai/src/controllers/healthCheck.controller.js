import mongoose from "mongoose";
import { redisClient, isRedisAvailable } from "../db/redis.js";
import { ApiRes } from "../utils/ApiRes.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req, res) => {
    const mongoState = mongoose.connection.readyState;

    const mongoStatusMap = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
    };

    let redisPing = "skipped";

    if (isRedisAvailable()) {
        try {
            redisPing = await redisClient.ping();
        } catch {
            redisPing = "failed";
        }
    }

    const health = {
        status: mongoState === 1 ? "ok" : "degraded",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        services: {
            api: "up",
            mongo: {
                status: mongoStatusMap[mongoState] || "unknown",
                host: mongoose.connection.host || null,
                name: mongoose.connection.name || null,
            },
            redis: {
                status: isRedisAvailable() ? "connected" : "degraded",
                ping: redisPing,
            },
        },
    };

    return res.status(200).json(
        new ApiRes(200, health, "Health check fetched successfully")
    );
});

export { healthCheck };