import { Router } from "express";
import asyncHandler from "./../../utils/handler/asynchandler.js";
import { sendMessage } from "./message.service.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { messageSchema } from "./message.validation.js";
import { uploadFiles } from "./../../utils/multer/multer.cloud.js";
const router = Router();

router.post(
	"/:receiver",
	uploadFiles().array("attachment", 4),
	isValid(messageSchema),
	asyncHandler(sendMessage)
);

export default router;
