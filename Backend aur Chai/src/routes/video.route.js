import { Router } from 'express';
import { validate } from "../middlewares/validate.middleware.js";
import {
    getAllVideosSchema,
    publishVideoSchema,
    updateVideoSchema,
    videoIdParamSchema,
} from "../validators/video.validator.js";
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    getRecommendedVideos,
} from "../controllers/video.controller.js"
import { optionalJWT, verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import {
    createUploadLimiter,
    lazyLimiter,
} from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router
    .route("/")
    .get(validate(getAllVideosSchema), getAllVideos)
    .post(
        lazyLimiter(createUploadLimiter),
        verifyJWT,
        upload.fields([
            { name: "videoFile", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 },
        ]),
        validate(publishVideoSchema),
        publishAVideo
    );

router.route("/:videoId/recommendations").get(
    validate(videoIdParamSchema),
    getRecommendedVideos
);


router
    .route("/:videoId")
    .get(optionalJWT, validate(videoIdParamSchema), getVideoById)
    .delete(verifyJWT, validate(videoIdParamSchema), deleteVideo)
    .patch(verifyJWT, upload.single("thumbnail"), validate(updateVideoSchema), updateVideo);


router.route("/toggle/publish/:videoId").patch(
    verifyJWT,
    validate(videoIdParamSchema),
    togglePublishStatus
);
export default router
