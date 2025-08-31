import { Router } from "express";
import asyncHandler from "./../../utils/handler/asynchandler.js";
import {
	login,
	loginWithGoogle,
	register,
	resendOtp,
	verifyAccount,
} from "./auth.service.js";
import { isValid } from "../../middleware/validation.middleware.js";
import {
	loginSchema,
	registerSchema,
	verifyAccountSchema,
} from "./auth.validation.js";

const router = Router();
router.post("/register", isValid(registerSchema), asyncHandler(register));
router.post("/login", isValid(loginSchema), asyncHandler(login));
router.post(
	"/verify-account",
	isValid(verifyAccountSchema),
	asyncHandler(verifyAccount)
);
router.post(
	"/resend-otp",
	isValid(verifyAccountSchema),
	asyncHandler(resendOtp)
);
router.post("/with-google", asyncHandler(loginWithGoogle));
export default router;
