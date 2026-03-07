const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const allowedOrigins = ["http://localhost:3000", "https://your-app.vercel.app"];
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
	}),
);

app.use(express.json());

const dbURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shelter_db";

mongoose
	.connect(dbURI)
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log(err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/materials", require("./routes/materials"));
app.use("/api/scenarios", require("./routes/scenarios"));
app.use("/api/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
