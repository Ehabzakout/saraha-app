import { Router } from "express";
import { deleteUser, uploadPhoto, uploadPhotoCloud } from "./user.service.js";
import asyncHandler from "./../../utils/handler/asynchandler.js";
import { uploadFiles } from "../../utils/multer/multer.local.js";
import { uploadFiles as uploadFilesCloud } from "../../utils/multer/multer.cloud.js";
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

router.post(
	"/upload-photo-cloud",
	isAuthenticated,
	uploadFilesCloud().single("cloudImg"),
	fileValidationType(),
	asyncHandler(uploadPhotoCloud)
);
export default router;
