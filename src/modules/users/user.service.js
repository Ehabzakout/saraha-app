import { User } from "../../DB/models/user.model.js";
import { Token } from "./../../DB/models/token.model.js";
import { unlinkSync } from "node:fs";
import cloudinary, {
	deleteFolder,
	uploadFileToCloud,
} from "./../../utils/cloud/cloudinary.cloud.js";

export const deleteUser = async (req, res) => {
	await User.updateOne(
		{ _id: req.user._id },
		{ deletedAt: Date.now(), credentialUpdatedAt: Date.now() }
	);
	await Token.deleteMany({ user: req.user._id });
	return res.status(200).json({ message: "User deleted successfully" });
	// **Remove user files from cloud**
	// const id = req.user._id;
	// if (req.user.cloudImg.publicId) {
	// 	await deleteFolder(`sarah-app/users/${id}`);
	// }
	// const deletedUser = await User.deleteOne({ _id: id });
	// if (!deletedUser) throw new Error("Can't found user", { cause: 404 });
	// return res.status(200).json({ message: "success" });
};

export const uploadPhoto = async (req, res) => {
	if (req.user.profileImg) unlinkSync(req.user.profileImg);
	const userExist = await User.findByIdAndUpdate(
		req.user._id,
		{
			profileImg: req.file.path,
		},
		{ new: true }
	);
	if (!userExist) throw new Error("user not found", { cause: 404 });
	return res.status(200).json({ message: "Done", userExist });
};

export const uploadPhotoCloud = async (req, res) => {
	await cloudinary.uploader.destroy(req.user.cloudImg.publicId);
	const { secure_url, public_id } = await uploadFileToCloud(req.file, {
		folder: `sarah-app/users/${req.user._id}/profile`,
	});

	const user = await User.findByIdAndUpdate(
		req.user._id,
		{ cloudImg: { secureUrl: secure_url, publicId: public_id } },
		{ new: true }
	);

	return res
		.status(200)
		.json({ message: "your image uploaded successfully", user });
};

export const userProfile = async (req, res) => {
	const user = await User.findOne(
		{ _id: req.user._id },
		{},
		{ populate: [{ path: "messages" }] }
	);
	return res.status(200).json({ message: "success", user });
};
