import express, { Request, Response } from "express";
import { protect, AuthRequest } from "../middleware/auth";
import User from "../models/User";

const router = express.Router();

// ROUTE 1: To save a new bookmark
// POST /api/articles/bookmark
router.post("/bookmark", protect, async (req: AuthRequest, res: Response) => {
  const { title, url, urlToImage, description, source } = req.body;
  const userId = req.user?.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAlreadyBookmarked = user.bookmarkedArticles.some(
      (article) => article.url === url
    );

    if (!isAlreadyBookmarked) {
      user.bookmarkedArticles.push({
        title,
        url,
        urlToImage,
        description,
        source,
      });
      await user.save();
    }

    res.status(200).json({
      message: "Article bookmarked",
      bookmarks: user.bookmarkedArticles,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ROUTE 2: To fetch all of a user's bookmarks
// GET /api/articles/bookmarks
router.get("/bookmarks", protect, async (req: AuthRequest, res: Response) => {
  try {
    // Find the user by the ID from the token and select only their bookmarks
    const user = await User.findById(req.user?.userId).select(
      "bookmarkedArticles"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send back the array of bookmarked articles
    res.status(200).json(user.bookmarkedArticles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
