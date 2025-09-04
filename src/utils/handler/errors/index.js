import { generateToken, verifyToken } from "../../token/index.js";
import { Token } from "../../../DB/models/token.model.js";

export const globalErrorHandler = async (err, req, res, next) => {
	// if (req.file) {
	// 	unlinkSync(req.file.path);
	// }

	if (err.message === "jwt expired") {
		const { refreshtoken } = req.headers;

		const { id, name } = verifyToken(refreshtoken);
		const existedToken = await Token.findOneAndDelete({
			token: refreshtoken,
			type: "refresh",
			user: id,
		});

		if (!existedToken) throw new Error("invalid refresh token", { cause: 401 });

		const accessToken = generateToken({ data: { id, name } });
		const newRefreshToken = generateToken({
			data: { id, name },
			expiresIn: "7d",
		});

		await Token.create({ token: newRefreshToken, user: id, type: "refresh" });
		return res.status(200).json({
			message: "refresh token successfully",
			accessToken,
			refreshtoken: newRefreshToken,
		});
	}
	return res
		.status(err.cause || 500)
		.json({ message: err.message || "Server Error" });
};
