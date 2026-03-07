const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
	title: { type: String, required: true },
	desc: { type: String, required: true },
	category: {
		type: String,
		enum: ["general", "anxiety", "stress", "apathy"],
		default: "general",
	},
	type: { type: String, enum: ["text", "video", "audio"], default: "text" },
	icon: { type: String, default: "📖" },
	content: { type: String, required: true },
});

module.exports = mongoose.model("Material", MaterialSchema);
