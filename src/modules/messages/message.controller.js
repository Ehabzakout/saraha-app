import { Router } from "express";
import asyncHandler from "./../../utils/handler/asynchandler.js";
import { sendMessage, specificMessage } from "./message.service.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { messageSchema, specificMessageSchema } from "./message.validation.js";
import { uploadFiles } from "./../../utils/multer/multer.cloud.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
const router = Router();

router.post(
	"/:receiver",
	uploadFiles().array("attachment", 4),
	isValid(messageSchema),
	asyncHandler(sendMessage)
);
router.get(
	"/:id",
	isAuthenticated,
	isValid(specificMessageSchema),
	asyncHandler(specificMessage)
);

export default router;
