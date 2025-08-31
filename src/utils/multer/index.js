import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

export function uploadFiles(allowedTypes = ["image/png", "image/jpeg"]) {
	const storage = diskStorage({
		destination: "upload",
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
