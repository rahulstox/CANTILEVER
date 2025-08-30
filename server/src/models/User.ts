// src/models/User.ts
import mongoose from "mongoose";

// Define a simple shape for a bookmarked article
const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  urlToImage: String,
  description: String,
  source: { name: String },
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // --- ADD THIS ---
    bookmarkedArticles: [ArticleSchema],
    // ----------------
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
