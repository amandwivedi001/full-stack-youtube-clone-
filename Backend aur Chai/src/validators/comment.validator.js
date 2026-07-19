import { z } from "zod";
import { objectIdSchema, paginationQuerySchema } from "./common.validator.js";

export const getVideoCommentsSchema = z.object({
    params: z.object({
        videoId: objectIdSchema,
    }),
    query: paginationQuerySchema,
});

export const addCommentSchema = z.object({
    params: z.object({
        videoId: objectIdSchema,
    }),
    body: z.object({
        comment: z.string().trim().min(1).max(1000),
    }),
});

export const commentIdParamSchema = z.object({
    params: z.object({
        commentId: objectIdSchema,
    }),
});

export const updateCommentSchema = z.object({
    params: z.object({
        commentId: objectIdSchema,
    }),
    body: z.object({
        comment: z.string().trim().min(1).max(1000),
    }),
});