import { uploadFilesToCloud } from "../../utils/cloud/cloudinary.cloud.js";
import { User } from "./../../DB/models/user.model.js";
import { Message } from "./../../DB/models/message.model.js";
import { verifyToken } from "../../utils/token/index.js";

export const sendMessage = async (req, res) => {
	let sender = undefined;
	if (req.headers.accesstoken) {
		const { accesstoken } = req.headers;
		const { id } = verifyToken(accesstoken);

		const senderId = await User.findById(id);
		if (senderId) sender = senderId._id;
	}

	const receiver = await User.findOne({ _id: req.params.receiver });
	if (!receiver) throw new Error("Receiver not found", { cause: 404 });
	const attachment = await uploadFilesToCloud(req.files, {
		folder: `sarah-app/messages/${receiver._id}`,
	});

	await Message.create({
		receiver: receiver._id,
		content: req.body.content,
		attachment,
		sender,
	});
	return res.json({ message: "Your message send successfully" });
};

export const specificMessage = async (req, res) => {
	const { id } = req.params;
	console.log(id, req.user._id);
	const message = await Message.findOne(
		{ _id: id, receiver: req.user._id },
		{},
		{
			populate: [
				{
					path: "receiver",
					select: "_id email firstName lastName bod profileImg cloudImg",
				},
			],
		}
	);
	if (!message) throw new Error("message not found", { cause: 404 });

	return res.status(200).json({ message: "success", message });
};
