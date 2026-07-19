import { z } from "zod";
import { objectIdSchema } from "./common.validator.js";

export const channelIdParamSchema = z.object({
    params: z.object({
        channelId: objectIdSchema,
    }),
});

export const subscriberIdParamSchema = z.object({
    params: z.object({
        subscriberId: objectIdSchema,
    }),
});