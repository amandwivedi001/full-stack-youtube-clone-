import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { validate } from "../middlewares/validate.middleware.js";

const schema = z.object({
    body: z.object({
        title: z.string().min(3),
    }),
    params: z.object({
        videoId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    }),
    query: z.object({
        page: z.coerce.number().min(1).default(1),
        sortBy: z.enum(["createdAt", "views"]).default("createdAt"),
    }),
});

describe("Validation middleware", () => {
    it("passes validated body, params, and query to request", () => {
        const req = {
            body: {
                title: "Valid title",
            },
            params: {
                videoId: "507f1f77bcf86cd799439011",
            },
            query: {
                page: "2",
                sortBy: "views",
            },
        };

        const next = vi.fn();

        validate(schema)(req, {}, next);

        expect(next).toHaveBeenCalled();

        expect(req.body).toEqual({
            title: "Valid title",
        });

        expect(req.params).toEqual({
            videoId: "507f1f77bcf86cd799439011",
        });

        expect(req.validatedQuery).toEqual({
            page: 2,
            sortBy: "views",
        });
    });

    it("rejects invalid ObjectId", () => {
        const req = {
            body: {
                title: "Valid title",
            },
            params: {
                videoId: "bad-id",
            },
            query: {
                page: "1",
                sortBy: "createdAt",
            },
        };

        const next = vi.fn();

        expect(() => validate(schema)(req, {}, next)).toThrow("Validation failed");
        expect(next).not.toHaveBeenCalled();
    });

    it("rejects invalid sort field", () => {
        const req = {
            body: {
                title: "Valid title",
            },
            params: {
                videoId: "507f1f77bcf86cd799439011",
            },
            query: {
                page: "1",
                sortBy: "password",
            },
        };

        const next = vi.fn();

        expect(() => validate(schema)(req, {}, next)).toThrow("Validation failed");
        expect(next).not.toHaveBeenCalled();
    });

    it("rejects invalid body", () => {
        const req = {
            body: {
                title: "No",
            },
            params: {
                videoId: "507f1f77bcf86cd799439011",
            },
            query: {
                page: "1",
                sortBy: "createdAt",
            },
        };

        const next = vi.fn();

        expect(() => validate(schema)(req, {}, next)).toThrow("Validation failed");
        expect(next).not.toHaveBeenCalled();
    });
});