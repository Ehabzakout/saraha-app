import Joi from "joi";

export function isValid(schema) {
	return (req, res, next) => {
		const { value, error } = schema.validate(req.body, { abortEarly: false });
		if (error) {
			const errorMessage = error.details.map((err) => err.message);
			throw new Error(errorMessage.join(", "), { cause: 400 });
		}
		next();
	};
}

export const generalFields = {
	firstName: Joi.string(),
	lastName: Joi.string(),
	email: Joi.string().email(),
	otp: Joi.string().length(5),
	password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/),
	phone: Joi.string().length(11),
	bod: Joi.date(),
	rePassword: (ref) => Joi.string().valid(Joi.ref(ref)),
};
