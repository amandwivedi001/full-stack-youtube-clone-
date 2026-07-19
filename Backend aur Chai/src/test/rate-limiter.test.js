import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../db/redis.js", () => ({
    redisClient: {
        sendCommand: vi.fn(),
    },
    isRedisAvailable: vi.fn(),
}));

import { isRedisAvailable } from "../db/redis.js";
import { createAuthLimiter } from "../middlewares/rateLimiter.middleware.js";

const createTestApp = () => {
    const app = express();

    app.use(createAuthLimiter());

    app.post("/login", (req, res) => {
        res.status(200).json({
            success: true,
            message: "Login route reached",
        });
    });

    app.use((err, req, res, next) => {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message,
        });
    });

    return app;
};

describe("Rate limiter behavior", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        isRedisAvailable.mockReturnValue(false);
    });

    it("allows requests when under auth limit using memory fallback", async () => {
        const app = createTestApp();

        const res = await request(app)
            .post("/login")
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Login route reached");
    });

    it("blocks requests after auth limit is exceeded", async () => {
        const app = createTestApp();

        for (let i = 0; i < 20; i++) {
            await request(app).post("/login").expect(200);
        }

        const res = await request(app)
            .post("/login")
            .expect(429);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Too many auth attempts, please try again later");
    });

    it("does not require Redis to create auth limiter", async () => {
        const app = createTestApp();

        const res = await request(app)
            .post("/login")
            .expect(200);

        expect(isRedisAvailable).toHaveBeenCalled();
        expect(res.body.success).toBe(true);
    });
});