const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	username: { type: String, required: true },
	diagnostic: {
		answers: [String],
		completedAt: { type: Date },
	},
	stats: {
		resilience: { type: Number, default: 0 },
		stabilityDays: { type: Number, default: 0 },
	},
	history: [
		{
			date: { type: Date, default: Date.now },
			score: { type: Number },
		},
	],
});

module.exports = mongoose.model("User", UserSchema);
