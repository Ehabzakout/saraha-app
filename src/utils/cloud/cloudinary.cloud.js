import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
	cloud_name: process.env.CLOUD_NAME,
});

export const uploadFileToCloud = async (file, options) => {
	const { secure_url, public_id } = await cloudinary.uploader.upload(
		file.path,
		options
	);
	return { secure_url, public_id };
};

export const uploadFilesToCloud = async (files, options) => {
	const attachment = [];
	for (const file of files) {
		const { secure_url, public_id } = await uploadFileToCloud(file, options);
		attachment.push({ secure_url, public_id });
	}
	return attachment;
};

export const deleteFolder = async (path) => {
	await cloudinary.api.delete_resources_by_prefix(path);
	await cloudinary.api.delete_folder(path);
};
export default cloudinary;
