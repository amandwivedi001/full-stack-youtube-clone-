import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { createGeneralLimiter } from "./middlewares/rateLimiter.middleware.js";
// route imports
import userRouter from "./routes/user.routes.js";
import healthcheckRouter from "./routes/healthCheck.route.js";
import tweetRouter from "./routes/tweet.route.js";
import subscriptionRouter from "./routes/subscription.route.js";
import videoRouter from "./routes/video.route.js";
import commentRouter from "./routes/comment.route.js";
import likeRouter from "./routes/like.route.js";
import playlistRouter from "./routes/playlist.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import notificationRouter from "./routes/notification.route.js";

export const createApp = () => {
    const app = express();

    app.set("trust proxy", 1);

    app.use(helmet());
    app.use(createGeneralLimiter());
    app.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }));

    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));
    app.use(express.static("public"));
    app.use(cookieParser());

    app.get("/", (req, res) => {
        res.send("Backend is running");
    });

    app.use("/api/v1/healthcheck", healthcheckRouter);
    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/tweets", tweetRouter);
    app.use("/api/v1/subscriptions", subscriptionRouter);
    app.use("/api/v1/videos", videoRouter);
    app.use("/api/v1/comments", commentRouter);
    app.use("/api/v1/likes", likeRouter);
    app.use("/api/v1/playlist", playlistRouter);
    app.use("/api/v1/dashboard", dashboardRouter);
    app.use("/api/v1/notifications", notificationRouter);

    app.get("/api/v1/instance", (req, res) => {
        res.json({
            instance: process.env.HOSTNAME,
            pid: process.pid,
            time: new Date().toISOString(),
        });
    });

    app.use((err, req, res, next) => {
        const statusCode = Number(err?.statusCode) || 500;

        return res.status(statusCode).json({
            success: false,
            message: err?.message || "Internal server error",
            errors: err?.errors || [],
            data: null
        });
    });

    return app;
};