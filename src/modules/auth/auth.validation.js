import Joi from "joi";

export const registerSchema = Joi.object({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().email(),
	password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/),
	phone: Joi.string().length(11),
	dob: Joi.date(),
}).or("email", "phone");

export const loginSchema = Joi.object({
	email: Joi.string().email(),
	password: Joi.string().regex(/^[a-zA-Z0-9],{6,30}$}/),
	phone: Joi.string().length(11),
}).or("email", "phone");

export const verifyAccountSchema = Joi.object({
	email: Joi.string().email().required(),
	otp: Joi.string().length(6).required(),
});
