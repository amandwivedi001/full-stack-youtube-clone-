import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";

describe("Protected routes", () => {
    it("rejects current-user without token", async () => {
        const app = createApp();

        const res = await request(app)
            .get("/api/v1/user/current-user")
            .expect(401);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Unauthorized request");
    });

    it("rejects video upload without token", async () => {
        const app = createApp();

        const res = await request(app)
            .post("/api/v1/videos")
            .expect(401);

        expect(res.body.success).toBe(false);
    });
});