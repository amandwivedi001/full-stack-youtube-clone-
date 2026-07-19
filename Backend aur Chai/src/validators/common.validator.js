import { z } from "zod";
import mongoose from "mongoose";

export const objectIdSchema = z
    .string()
    .refine((value) => mongoose.isValidObjectId(value), {
        message: "Invalid ObjectId",
    });

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
});