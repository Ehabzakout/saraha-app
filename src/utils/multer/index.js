import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import { existsSync, mkdirSync } from "node:fs";
export function uploadFiles(
	{ folder, allowedTypes } = {
		folder: "profileImg",
		allowedTypes: ["image/png", "image/jpeg"],
	}
) {
	const storage = diskStorage({
		destination: (req, file, cb) => {
			const dest = `upload/${req.user._id}/${folder}`;
			if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
			cb(null, dest);
		},
		filename: (req, file, cb) => {
			cb(null, nanoid(5) + "_" + file.originalname);
		},
	});
	const fileFilter = (req, file, cb) => {
		if (allowedTypes.includes(file.mimetype)) cb(null, true);
		else cb(new Error("invalid file type", { cause: 400 }));
	};
	return multer({ fileFilter, storage });
}
