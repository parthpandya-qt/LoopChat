import { Router } from "express";
import { userLogin, userLogout, userSignUp } from "../controller/auth.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/signup").post(userSignUp)
router.route("/login").post(userLogin)
router.route("/logout").post(verifyJWT,userLogout)





export default router;