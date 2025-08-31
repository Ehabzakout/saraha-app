import jwt from "jsonwebtoken";
import { User } from "../../DB/models/user.model.js";

export const deleteUser = async (req, res) => {
	const { token } = req.headers;
	const { id } = jwt.verify(token, "hgfjhbjbbjbjhbh");
	const deletedUser = await User.findOneAndDelete(id);
	if (!deletedUser) throw new Error("Can't found user", { cause: 404 });
	return res.status(200).json({ message: "success" });
};
