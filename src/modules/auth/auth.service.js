import { User } from "../../DB/models/user.model.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/email/index.js";
import { generateOTP } from "../../utils/otp/index.js";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../../utils/token/index.js";
import { comparePassword, hashPassword } from "../../utils/hash/index.js";
import { Token } from "../../DB/models/token.model.js";

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

// send otp
export const sendOtp = async (req, res) => {
	const { email } = req.body;
	const { otp, expireDate } = generateOTP();
	const user = await User.findOneAndUpdate({ email }, { otp, expireDate });
	if (!user) throw new Error("Invalid Email", { cause: 404 });
	await sendEmail({
		to: email,
		subject: "New OTP",
		html: `<p>send new OTP : ${otp}`,
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
	const match = comparePassword(password, existedUser.password);
	if (!match) throw new Error("Incorrect email or password", { cause: 401 });

	// if user deleted before now
	if (existedUser.deletedAt) {
		existedUser.deletedAt = undefined;
		await existedUser.save();
	}

	// generate tokens
	const accessToken = generateToken({
		data: {
			name: existedUser.fullName,
			id: existedUser._id,
		},
	});

	const refreshToken = generateToken({
		data: { name: existedUser.fullName, id: existedUser._id },
		expiresIn: "7d",
	});

	await Token.create({
		token: refreshToken,
		type: "refresh",
		user: existedUser._id,
	});
	return res
		.status(200)
		.json({ message: "logged in successfully", accessToken, refreshToken });
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

	// if user deleted before now
	if (existedUser.deletedAt) {
		existedUser.deletedAt = undefined;
		await existedUser.save();
	}
	const accessToken = generateToken({
		data: {
			name: existedUser.fullName,
			id: existedUser._id,
		},
	});
	const refreshToken = generateToken({
		data: { name: existedUser.fullName, id: existedUser._id },
		expiresIn: "7d",
	});

	await Token.create({
		token: refreshToken,
		type: "refresh",
		user: existedUser._id,
	});
	return res.status(200).json({ message: "success", accessToken });
};

export const resetPassword = async (req, res) => {
	const { email, otp, newPassword, rePassword } = req.body;
	const existedUser = await User.findOne({ email });
	if (!existedUser) throw new Error("user not found", { cause: 404 });

	if (+otp !== existedUser.otp) throw new Error("Invalid Otp", { cause: 400 });
	if (existedUser.expireDate < Date.now())
		throw new Error("Expired OTP", { cause: 400 });

	existedUser.password = hashPassword(newPassword);
	existedUser.otp = undefined;
	existedUser.expireDate = undefined;
	existedUser.credentialUpdatedAt = Date.now();
	await existedUser.save();
	await Token.deleteMany({ user: existedUser._id, type: "refresh" });
	return res.status(200).json({ message: "Password updated successfully" });
};

// Logout
export const logout = async (req, res) => {
	const { accessToken } = req.headers;
	await Token.create({ token: accessToken, user: req.user._id });
	return res.status(200).json({ message: "logged out successfully" });
};

// update password
export const updatePassword = async (req, res) => {
	const { newPassword, password } = req.body;
	const user = await User.findOneAndUpdate({ _id: req.user._id });
	if (!user) throw new Error("user not found", { cause: 404 });

	const match = comparePassword(password, user.password);
	if (!match) throw new Error("incorrect password");
	user.password = hashPassword(newPassword);
	user.credentialUpdatedAt = Date.now();
	await user.save();

	return res
		.status(200)
		.json({ message: "Your password updated successfully" });
};
