import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
    registerUserSchema,
    loginUserSchema,
    updateAccountSchema,
    changePasswordSchema,
} from "../validators/user.validator.js";
import {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannel,
    getWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { optionalJWT, verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createAuthLimiter,
    lazyLimiter,
} from "../middlewares/rateLimiter.middleware.js";
const router = Router()

router.route("/register").post(
    lazyLimiter(createAuthLimiter),
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    validate(registerUserSchema),
    registerUser
);

router.route("/login").post(
    lazyLimiter(createAuthLimiter),
    validate(loginUserSchema),
    loginUser
);

//secure route
router.route("/logOut").post(verifyJWT, logOutUser)

router.route("/refresh-token").post(lazyLimiter(createAuthLimiter),refreshAccessToken)

router.route("/change-password").post(
    lazyLimiter(createAuthLimiter),
    verifyJWT,
    validate(changePasswordSchema),
    changeUserPassword
);

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account-details").patch(
    verifyJWT,
    validate(updateAccountSchema),
    updateAccountDetails
);

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

router.route("/coverImage").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(optionalJWT, getUserChannel)

router.route("/history").get(verifyJWT, getWatchHistory)

export default router;
