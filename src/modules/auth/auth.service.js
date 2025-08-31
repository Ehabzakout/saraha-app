import { User } from "../../DB/models/user.model.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/email/index.js";
import { generateOTP } from "../../utils/otp/index.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

// Register
export const register = async (req, res) => {
	const { email, password, firstName, lastName, bod, phone } = req.body;
	const existedUser = await User.findOne({
		$or: [
			{
				$and: [
					{ email: { $exists: true } },
					{ email: { $ne: null } },
					{ email },
				],
			},

			{
				$and: [
					{ phone: { $exists: true } },
					{ phone: { $ne: null } },
					{ phone },
				],
			},
		],
	});

	if (existedUser) throw new Error("User already exist", { cause: 409 });
	const hashPassword = bcrypt.hashSync(password, 10);
	const { otp, expireDate } = generateOTP();
	const newUser = new User({
		email,
		phone,
		password: hashPassword,
		firstName,
		lastName,
		bod,
		otp,
		expireDate,
	});
	await sendEmail({
		to: email,
		subject: `OTP verification code`,
		html: `<p>OTP verification code is: ${otp}</p>`,
	});

	await newUser.save();
	return res.status(201).json({ message: "user created successfully" });
};

// Verify code
export const verifyAccount = async (req, res) => {
	const { email, otp } = req.body;
	const existedUser = await User.findOne({
		email,
		otp,
		expireDate: { $gt: Date.now() },
	});
	if (!existedUser) throw new Error("Invalid OTP", { cause: 401 });
	existedUser.otp = undefined;
	existedUser.expireDate = undefined;
	existedUser.isValid = true;
	await existedUser.save();
	return res.status(200).json({ message: "user verified successfully" });
};

// Resend otp
export const resendOtp = async (req, res) => {
	const { email } = req.body;
	const { otp, expireDate } = generateOTP();
	await User.updateOne({ email }, { otp, expireDate });
	await sendEmail({
		to: email,
		subject: "Resend OTP",
		html: `<p>Resend new OTP : ${otp}`,
	});
	return res.status(200).json({ message: "OTP Send successfully" });
};

// Login by credentials
export const login = async (req, res) => {
	const { email, phone, password } = req.body;
	const existedUser = await User.findOne({
		$or: [
			{
				$and: [
					{ email: { $exists: true } },
					{ email: { $ne: null } },
					{ email },
				],
			},
			{
				$and: [
					{ phone: { $exists: true } },
					{ phone: { $ne: null } },
					{ phone },
				],
			},
		],
	});

	if (!existedUser)
		throw new Error("You don't have an account", { cause: 404 });
	if (existedUser.isValid === false)
		throw new Error("Verify you account", { cause: 401 });
	const match = bcrypt.compareSync(password, existedUser.password);
	if (!match) throw new Error("Incorrect email or password", { cause: 401 });
	const token = jwt.sign(
		{ name: existedUser.fullName, id: existedUser._id },
		"hgfjhbjbbjbjhbh",
		{ expiresIn: "15m" }
	);
	return res.status(200).json({ message: "logged in successfully", token });
};

// Login with google
export const loginWithGoogle = async (req, res) => {
	const { tokenId } = req.body;
	const client = new OAuth2Client(
		"594465096502-j64msv9nqdhskf45lj85m140uglboad4.apps.googleusercontent.com"
	);
	const ticket = await client.verifyIdToken({ idToken: tokenId });
	const payload = ticket.getPayload();

	let existedUser = await User.findOne({ email: payload.email });
	if (!existedUser) {
		existedUser = new User({
			email: payload.email,
			isValid: true,
			fullName: payload.name,
			userAgent: "google",
		});
		await existedUser.save();
	}
	const token = jwt.sign(
		{ name: existedUser.fullName, id: existedUser._id },
		"hgfjhbjbbjbjhbh",
		{ expiresIn: "15m" }
	);
	return res.status(200).json({ message: "success", token });
};
