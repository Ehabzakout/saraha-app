import mongoose from "mongoose";

export function connectDB() {
	mongoose
		.connect(process.env.DB_CONNECTION)
		.then(() => {
			console.log("Connected to DB");
		})
		.catch(() => {
			console.log("Fail to connect DB");
		});
}
