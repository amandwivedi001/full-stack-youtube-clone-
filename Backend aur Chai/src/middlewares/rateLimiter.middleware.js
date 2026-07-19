import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient, isRedisAvailable } from "../db/redis.js";
import { ApiError } from "../utils/ApiError.js";

const rateLimitHandler = (req, res, next, options) => {
    next(
        new ApiError(
            options.statusCode,
            options.message || "Too many requests, please try again later"
        )
    );
};

const createStore = (prefix) => {
    if (!isRedisAvailable()) {
        console.warn(`Redis unavailable. Using memory store for ${prefix}`);
        return undefined;
    }

    return new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
        prefix,
    });
};

const createLimiter = ({ windowMs, limit, message, prefix }) => {
    return rateLimit({
        windowMs,
        limit,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        passOnStoreError: true,
        message,
        store: createStore(prefix),
        handler: rateLimitHandler,
    });
};

export const createGeneralLimiter = () =>
    createLimiter({
        windowMs: 15 * 60 * 1000,
        limit: 300,
        prefix: "rl:general:",
        message: "Too many requests, please try again later",
    });

export const createAuthLimiter = () =>
    createLimiter({
        windowMs: 15 * 60 * 1000,
        limit: 20,
        prefix: "rl:auth:",
        message: "Too many auth attempts, please try again later",
    });

export const createUploadLimiter = () =>
    createLimiter({
        windowMs: 60 * 60 * 1000,
        limit: 30,
        prefix: "rl:upload:",
        message: "Too many uploads, please try again later",
    });


export const lazyLimiter = (createLimiterFn) => {
    let limiter;

    return (req, res, next) => {
        if (!limiter) {
            limiter = createLimiterFn();
        }

        return limiter(req, res, next);
    };
};