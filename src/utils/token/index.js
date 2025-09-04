import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;
export function generateToken({ data, secret = secretKey, expiresIn = "15m" }) {
	return jwt.sign(data, secret, { expiresIn });
}
export function verifyToken(token, secret = secretKey) {
	return jwt.verify(token, secret);
}
