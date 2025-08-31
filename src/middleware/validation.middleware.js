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
