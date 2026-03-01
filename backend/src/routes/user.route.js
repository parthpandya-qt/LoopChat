import { Router } from "express";
import { userLogin, userLogout, userSignUp,refreshAccessToken,updateProfile,checkAuth } from "../controller/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.controller.js";

const router = Router();
router.route("/signup").post( upload.single("avatar"),userSignUp)
router.route("/login").post(userLogin)
router.route("/logout").post(verifyJWT,userLogout)
router.route("/refresh").get(verifyJWT,refreshAccessToken)
router.route("/update-profile").put(verifyJWT,upload.single("avatar"),updateProfile)
router.route("/check").get(verifyJWT, checkAuth);





export default router;