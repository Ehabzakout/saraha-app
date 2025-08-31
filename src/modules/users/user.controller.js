import { Router } from "express";
import { deleteUser, uploadPhoto } from "./user.service.js";
import asyncHandler from "./../../utils/handler/asynchandler.js";
import { uploadFiles } from "../../utils/multer/index.js";
import { fileValidationType } from "../../middleware/file-validation.middleware.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";

const router = Router();

router.delete("/", asyncHandler(deleteUser));
router.post(
	"/upload-photo",
	isAuthenticated,
	uploadFiles().single("profileImg"),
	fileValidationType(),
	asyncHandler(uploadPhoto)
);
export default router;
