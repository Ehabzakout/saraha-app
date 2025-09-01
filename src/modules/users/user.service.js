import jwt from "jsonwebtoken";
import { User } from "../../DB/models/user.model.js";
import { unlinkSync } from "node:fs";

export const deleteUser = async (req, res) => {
	const { token } = req.headers;
	const { id } = jwt.verify(token, "hgfjhbjbbjbjhbh");
	const deletedUser = await User.findOneAndDelete(id);
	if (!deletedUser) throw new Error("Can't found user", { cause: 404 });
	return res.status(200).json({ message: "success" });
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
