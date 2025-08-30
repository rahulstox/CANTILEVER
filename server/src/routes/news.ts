// server/src/routes/news.ts
import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const apiKey = process.env.NEWS_API_KEY;

    // --- CHANGE: Switched to the /everything endpoint for a full search ---
    const response = await axios.get(`https://newsapi.org/v2/everything`, {
      params: {
        q,
        apiKey,
        pageSize: 40, // Get a few more results
        language: "en",
        sortBy: "publishedAt", // Sort by newest articles first
      },
    });

    console.log(
      `Received ${response.data.articles.length} articles from NewsAPI for query: ${q}`
    );
    res.status(200).json(response.data.articles);
  } catch (error: any) {
    console.error(
      "Error fetching news from API:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Failed to fetch news" });
  }
});

export default router;
