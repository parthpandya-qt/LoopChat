import { Router } from "express";
import {  userLeftBar,getMessagesByUserId,postMessage  } from "../controller/message.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.controller.js";


const router = Router()
router.use(verifyJWT)
router.route("/user").get(userLeftBar)
router.route("/:id").get(getMessagesByUserId)
router.route("/send/:id").post(upload.single("image"),postMessage)

export default router;