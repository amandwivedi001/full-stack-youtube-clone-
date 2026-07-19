import { Router } from 'express';
import { validate } from "../middlewares/validate.middleware.js";
import {
    addCommentSchema,
    commentIdParamSchema,
    getVideoCommentsSchema,
    updateCommentSchema,
} from "../validators/comment.validator.js";
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router
    .route("/:videoId")
    .get(validate(getVideoCommentsSchema), getVideoComments)
    .post(verifyJWT, validate(addCommentSchema), addComment);

router
    .route("/c/:commentId")
    .delete(verifyJWT, validate(commentIdParamSchema), deleteComment)
    .patch(verifyJWT, validate(updateCommentSchema), updateComment);
export default router;
