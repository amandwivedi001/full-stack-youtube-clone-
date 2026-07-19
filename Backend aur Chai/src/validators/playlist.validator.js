import { z } from "zod";
import { objectIdSchema } from "./common.validator.js";

export const createPlaylistSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2).max(100),
        discription: z.string().trim().max(1000).optional(),
    }),
});

export const playlistIdParamSchema = z.object({
    params: z.object({
        playlistId: objectIdSchema,
    }),
});

export const userIdParamSchema = z.object({
    params: z.object({
        userId: objectIdSchema,
    }),
});

export const updatePlaylistSchema = z.object({
    params: z.object({
        playlistId: objectIdSchema,
    }),
    body: z.object({
        name: z.string().trim().min(2).max(100).optional(),
        discription: z.string().trim().max(1000).optional(),
    }),
});

export const playlistVideoParamsSchema = z.object({
    params: z.object({
        playlistId: objectIdSchema,
        videoId: objectIdSchema,
    }),
});