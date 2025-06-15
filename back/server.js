// back/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Make sure mongoose is required

const app = express();
// Use a port like 5001 to avoid conflicts with the React frontend's default port (3000)
const PORT = process.env.PORT || 5001;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing
app.use(cors());
// Allow the server to parse JSON in request bodies
app.use(express.json());

// --- MongoDB Connection ---
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
    .then(() => console.log("MongoDB connection established successfully"))
    .catch(err => console.log(err));

// --- Routes ---
// A simple test route to confirm the server is working
app.get('/api', (req, res) => {
  res.json({ message: "Hello! The backend is sending its greetings." });
});

// --- Routes ---
// Use the projects routes defined in routes/projects.js
app.use('/api/projects', require('./routes/projects'));

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});