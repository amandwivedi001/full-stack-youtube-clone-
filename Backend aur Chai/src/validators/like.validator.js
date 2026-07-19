import { z } from "zod";
import { objectIdSchema } from "./common.validator.js";

export const videoLikeParamSchema = z.object({
    params: z.object({
        videoId: objectIdSchema,
    }),
});

export const commentLikeParamSchema = z.object({
    params: z.object({
        commentId: objectIdSchema,
    }),
});

export const tweetLikeParamSchema = z.object({
    params: z.object({
        tweetId: objectIdSchema,
    }),
});
