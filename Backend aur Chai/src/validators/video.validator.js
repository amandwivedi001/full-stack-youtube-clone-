import { z } from "zod";
import { objectIdSchema, paginationQuerySchema } from "./common.validator.js";

export const getAllVideosSchema = z.object({
    query: paginationQuerySchema.extend({
        query: z.string().trim().max(100).optional(),
        sortBy: z.enum(["createdAt", "views", "likeCount", "duration", "title"]).optional(),
        sortType: z.enum(["asc", "desc"]).optional(),
        userId: objectIdSchema.optional(),
    }),
});

export const videoIdParamSchema = z.object({
    params: z.object({
        videoId: objectIdSchema,
    }),
});

export const publishVideoSchema = z.object({
    body: z.object({
        title: z.string().trim().min(3).max(120),
        description: z.string().trim().min(3).max(5000),
    }),
});

export const updateVideoSchema = z.object({
    params: z.object({
        videoId: objectIdSchema,
    }),
    body: z.object({
        title: z.string().trim().min(3).max(120).optional(),
        description: z.string().trim().min(3).max(5000).optional(),
    }),
});