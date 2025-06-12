const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

// App setup
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON body
app.use('/uploads', express.static('uploads')); // Serve uploaded profile pics

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB connected");
}).catch(err => {
    console.error("❌ MongoDB connection error:", err);
});

// Basic route test
app.get("/", (req, res) => {
    res.send("LBS Connect backend running");
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
