import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const messageSchema = Joi.object({
	receiver: generalFields.objectId.required(),
	content: Joi.string().min(3).max(100),
	sender: generalFields.objectId,
}).required();
