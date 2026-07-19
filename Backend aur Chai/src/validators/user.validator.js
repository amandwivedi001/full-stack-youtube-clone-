import { z } from "zod";

export const registerUserSchema = z.object({
    body: z.object({
        fullname: z.string().trim().min(2).max(80),
        username: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
        email: z.string().trim().email(),
        password: z.string().min(6).max(100),
    }),
});

export const loginUserSchema = z.object({
    body: z.object({
        username: z.string().trim().optional(),
        email: z.string().trim().email().optional(),
        password: z.string().min(1),
    }).refine((data) => data.username || data.email, {
        message: "Username or email is required",
        path: ["username"],
    }),
});

export const updateAccountSchema = z.object({
    body: z.object({
        fullname: z.string().trim().min(2).max(80).optional(),
        email: z.string().trim().email().optional(),
    }).refine((data) => data.fullname || data.email, {
        message: "Fullname or email is required",
    }),
});

export const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string().min(1),
        newPassword: z.string().min(6).max(100),
    }),
});