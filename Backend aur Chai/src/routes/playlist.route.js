import { Router } from 'express';
import { validate } from "../middlewares/validate.middleware.js";
import {
    createPlaylistSchema,
    playlistIdParamSchema,
    playlistVideoParamsSchema,
    updatePlaylistSchema,
    userIdParamSchema,
} from "../validators/playlist.validator.js";
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT);

router.route("/").post(
    validate(createPlaylistSchema),
    createPlaylist
);

router
    .route("/:playlistId")
    .get(validate(playlistIdParamSchema), getPlaylistById)
    .patch(validate(updatePlaylistSchema), updatePlaylist)
    .delete(validate(playlistIdParamSchema), deletePlaylist);

router.route("/add/:videoId/:playlistId").patch(
    validate(playlistVideoParamsSchema),
    addVideoToPlaylist
);

router.route("/remove/:videoId/:playlistId").patch(
    validate(playlistVideoParamsSchema),
    removeVideoFromPlaylist
);

router.route("/user/:userId").get(
    validate(userIdParamSchema),
    getUserPlaylists
);

export default router