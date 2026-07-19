import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";

describe("Auth validation", () => {
    it("rejects login without username/email", async () => {
        const app = createApp();

        const res = await request(app)
            .post("/api/v1/user/login")
            .send({
                password: "secret123",
            })
            .expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Validation failed");
    });

    it("rejects invalid email on register", async () => {
        const app = createApp();

        const res = await request(app)
            .post("/api/v1/user/register")
            .field("fullname", "Test User")
            .field("username", "testuser")
            .field("email", "bad-email")
            .field("password", "secret123")
            .expect(400);

        expect(res.body.success).toBe(false);
    });
});