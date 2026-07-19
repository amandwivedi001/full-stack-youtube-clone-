import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";

describe("Healthcheck", () => {
    it("returns API health status", async () => {
        const app = createApp();

        const res = await request(app)
            .get("/api/v1/healthcheck")
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.data.services.api).toBe("up");
    });
});