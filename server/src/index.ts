import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import articleRoutes from "./routes/articles";
import newsRoutes from "./routes/news";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------- CORS Setup -------------------
// Allow both local and deployed frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://cantilever-omega.vercel.app", // replace with your Vercel frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies/auth headers
  })
);
// --------------------------------------------------

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Test route
app.get("/api/health", (req, res) => {
  res.json({ status: "UP", timestamp: new Date() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/news", newsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
