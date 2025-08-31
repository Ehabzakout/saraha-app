import { readFileSync } from "node:fs";
import { fileTypeFromBuffer } from "file-type";
export const fileValidationType = (
	allowedTypes = ["image/png", "image/jpeg"]
) => {
	return async (req, res, next) => {
		const path = req.file.path;
		const buffer = readFileSync(path);
		const type = await fileTypeFromBuffer(buffer);

		if (!type || !allowedTypes.includes(type.mime))
			return next(new Error("invalid file type", { cause: 400 }));
		return next();
	};
};
