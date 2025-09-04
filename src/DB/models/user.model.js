import { model, Schema } from "mongoose";

const schema = new Schema(
	{
		firstName: { type: String, required: true, trim: true },
		lastName: { type: String, required: true, trim: true },
		email: {
			type: String,
			required: function () {
				if (this.phone) return false;
				return true;
			},
			lowercase: true,
			trim: true,
		},
		phone: {
			type: String,
			required: function () {
				if (this.email) return false;
				return true;
			},
			trim: true,
		},
		password: {
			type: String,
			required: function () {
				if (this.userAgent === "google") return false;
				return true;
			},
			trim: true,
		},
		bod: {
			type: Date,
			required: function () {
				if (this.userAgent === "google") return false;
				return true;
			},
			trim: true,
		},
		otp: { type: Number },
		expireDate: { type: Date },
		isValid: {
			type: Boolean,
			default: false,
		},
		userAgent: {
			type: String,
			enum: ["local", "google"],
			default: "local",
		},
		profileImg: {
			type: String,
		},
		cloudImg: {
			secureUrl: String,
			publicId: String,
		},
		credentialUpdatedAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

schema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});
schema.virtual("fullName").set(function (value) {
	const [first, last] = value.split(" ");
	this.firstName = first;
	this.lastName = last;
});
schema.virtual("age").get(function () {
	const date = new Date(this.bod).getFullYear();
	const now = new Date().getFullYear();
	return Math.floor(now - date);
});
export const User = model("User", schema);
