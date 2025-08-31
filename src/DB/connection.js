import mongoose from "mongoose";

export function connectDB() {
	mongoose
		.connect("mongodb://127.0.0.1:27017/saraha-app")
		.then(() => {
			console.log("Connected to DB");
		})
		.catch(() => {
			console.log("Fail to connect DB");
		});
}
