import { connectDB } from "./DB/connection.js";
import auth from "./modules/auth/auth.controller.js";
import users from "./modules/users/user.controller.js";
import messages from "./modules/messages/message.controller.js";
import cors from "cors";
import { globalErrorHandler } from "./utils/handler/errors/index.js";
import rateLimit from "express-rate-limit";
import { scheduleJob } from "node-schedule";
import { User } from "./DB/models/user.model.js";
import { deleteFolder } from "./utils/cloud/cloudinary.cloud.js";
import { Message } from "./DB/models/message.model.js";
import { Token } from "./DB/models/token.model.js";
export default function bootstrap(app, express) {
	const limiter = rateLimit({
		windowMs: 5 * 60 * 1000,
		limit: 5,
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

	scheduleJob("1 2 3 * * *", async () => {
		const users = await User.find({
			deletedAt: { $lte: Date.now() - 3 * 30 * 24 * 60 * 60 * 1000 },
		});

		for (const user of users) {
			if (user.cloudImg) await deleteFolder(`sarah-app/users/${user._id}`);
		}

		await Message.deleteMany({
			receiver: { $in: users.map((user) => user._id) },
		});

		await User.deleteMany({
			deletedAt: { $lte: Date.now() - 3 * 30 * 24 * 60 * 60 * 1000 },
		});

		await Token.deleteMany({ user: { $in: users.map((user) => user._id) } });
	});

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
