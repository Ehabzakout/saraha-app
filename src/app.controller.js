import { connectDB } from "./DB/connection.js";
import auth from "./modules/auth/auth.controller.js";
import users from "./modules/users/user.controller.js";
import messages from "./modules/messages/message.controller.js";
import cors from "cors";
import { globalErrorHandler } from "./utils/handler/errors/index.js";
import rateLimit from "express-rate-limit";
export default function bootstrap(app, express) {
	const limiter = rateLimit({
		windowMs: 60 * 1000,
		limit: 3,
		handler: (req, res, nex, options) => {
			throw new Error(options.message, { cause: options.statusCode });
		},
		identifier: (req) => req.ip,
		skipSuccessfulRequests: true,
	});
	connectDB();
	app.use(
		cors({
			origin: "*",
		})
	);

	app.use(express.json());
	app.use("/upload", express.static("upload"));
	app.use("/auth", limiter, auth);
	app.use("/users", users);
	app.use("/message", messages);
	app.all("/{*routes}", (req, res) =>
		res.status(404).json({ message: "Route not found" })
	);
	app.use(globalErrorHandler);
}
