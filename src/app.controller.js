import { connectDB } from "./DB/connection.js";
import auth from "./modules/auth/auth.controller.js";
import users from "./modules/users/user.controller.js";
import cors from "cors";
export default function bootstrap(app, express) {
	connectDB();
	app.use(
		cors({
			origin: "*",
		})
	);
	app.use(express.json());
	app.use("/upload", express.static("upload"));
	app.use("/auth", auth);
	app.use("/users", users);
	app.use((err, req, res, next) => {
		return res
			.status(err.cause || 500)
			.json({ message: err.message || "Server Error" });
	});
}
