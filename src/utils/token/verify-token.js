import jwt from "jsonwebtoken";
export function verifyToken(token, secret = "hgfjhbjbbjbjhbh") {
	return jwt.verify(token, secret);
}
