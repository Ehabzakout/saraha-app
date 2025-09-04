import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const registerSchema = Joi.object({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().email(),
	password: Joi.string()
		.regex(/^[a-zA-Z0-9]{8,30}$/)
		.required(),
	phone: Joi.string().length(11),
	bod: Joi.date(),
	rePassword: generalFields.rePassword("password").required(),
})
	.or("email", "phone")
	.required();

export const loginSchema = Joi.object({
	email: generalFields.email,
	password: generalFields.password.required(),
	phone: generalFields.phone,
})
	.or("email", "phone")
	.required();

export const verifyAccountSchema = Joi.object({
	email: generalFields.email.required(),
	otp: generalFields.otp.required(),
}).required();

export const resetPasswordSchema = Joi.object({
	email: generalFields.email.required(),
	otp: generalFields.otp.required(),
	newPassword: generalFields.password.required(),
	rePassword: generalFields.rePassword("newPassword").required(),
}).required();
