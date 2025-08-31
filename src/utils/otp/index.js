export function generateOTP(expireTime = 15 * 60 * 1000) {
	const otp = Math.floor(Math.random() * 90000 + 10000);
	const expireDate = Date.now() + expireTime;
	return { otp, expireDate };
}
