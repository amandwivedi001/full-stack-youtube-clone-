import { Router } from 'express';
import { validate } from "../middlewares/validate.middleware.js";
import {
    commentLikeParamSchema,
    tweetLikeParamSchema,
    videoLikeParamSchema,
} from "../validators/like.validator.js";
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(
    validate(videoLikeParamSchema),
    toggleVideoLike
);

router.route("/toggle/c/:commentId").post(
    validate(commentLikeParamSchema),
    toggleCommentLike
);

router.route("/toggle/t/:tweetId").post(
    validate(tweetLikeParamSchema),
    toggleTweetLike
);
router.route("/videos").get(getLikedVideos);

export default router