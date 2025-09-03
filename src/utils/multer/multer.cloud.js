import multer, { diskStorage } from "multer";

export function uploadFiles(
	{ folder, allowedTypes } = {
		folder: "profileImg",
		allowedTypes: ["image/png", "image/jpeg"],
	}
) {
	const storage = diskStorage({});
	const fileFilter = (req, file, cb) => {
		if (allowedTypes.includes(file.mimetype)) cb(null, true);
		else cb(new Error("invalid file type", { cause: 400 }));
	};
	return multer({ fileFilter, storage });
}
