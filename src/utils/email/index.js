import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		auth: {
			user: process.env.USER_EMAIL,
			pass: process.env.PASSWORD,
		},
	});

	await transporter.sendMail({
		from: "Saraha App<ftwehab@gmail.com>",
		to,
		subject,
		html,
	});
}
