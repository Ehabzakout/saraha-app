import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		auth: {
			user: "ftwehab@gmail.com",
			pass: "mvex pdfh dgxl lutk",
		},
	});

	await transporter.sendMail({
		from: "Saraha App<ftwehab@gmail.com>",
		to,
		subject,
		html,
	});
}
