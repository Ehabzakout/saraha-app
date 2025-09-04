import { User } from "../DB/models/user.model.js";
import { verifyToken } from "../utils/token/index.js";
import { Token } from "./../DB/models/token.model.js";

export const isAuthenticated = async (req, res, next) => {
	const { accesstoken } = req.headers;

	if (!accesstoken) throw new Error("You are not loggedin");
	const { id, iat } = verifyToken(accesstoken);
	const blockedToken = await Token.findOne({
		token: accesstoken,
		type: "access",
	});
	if (blockedToken) throw new Error("Invalid Token", { cause: 401 });
	const existedUser = await User.findById(id);
	if (!existedUser) throw new Error("user not found", { cause: 404 });
	console.log(new Date(iat * 1000), existedUser.credentialUpdatedAt);
	if (new Date(iat * 1000) < existedUser.credentialUpdatedAt)
		throw new Error("Token expired");
	req.user = existedUser;
	return next();
};
