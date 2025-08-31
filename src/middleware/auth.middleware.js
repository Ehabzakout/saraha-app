import { User } from "../DB/models/user.model.js";
import { verifyToken } from "../utils/token/verify-token.js";

export const isAuthenticated = async (req, res, next) => {
	const { token } = req.headers;
	if (!token) throw new Error("You are not loggedin");
	const { id } = verifyToken(token);
	const existedUser = await User.findById(id);
	if (!existedUser) throw new Error("user not found", { cause: 404 });
	req.user = existedUser;
	return next();
};
