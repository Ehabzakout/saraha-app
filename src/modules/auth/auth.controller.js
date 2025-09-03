import { Router } from "express";
import asyncHandler from "./../../utils/handler/asynchandler.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import {
	login,
	loginWithGoogle,
	logout,
	register,
	resetPassword,
	sendOtp,
	verifyAccount,
} from "./auth.service.js";
import { isValid } from "../../middleware/validation.middleware.js";
import {
	loginSchema,
	registerSchema,
	resetPasswordSchema,
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
router.post("/send-otp", asyncHandler(sendOtp));
router.post("/with-google", asyncHandler(loginWithGoogle));
router.patch(
	"/reset-password",
	isValid(resetPasswordSchema),
	asyncHandler(resetPassword)
);

router.post("/logout", isAuthenticated, asyncHandler(logout));
export default router;
