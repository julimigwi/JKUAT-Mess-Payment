const express = require("express");
const mongoose = require("mongoose"); 
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jkuat_mess";

// ✅ Connect to MongoDB (without deprecated options)
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
    res.send("Welcome to JKUAT Mess MPesa Integration!");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


