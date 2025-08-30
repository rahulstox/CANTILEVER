// app/bookmarks/page.tsx
"use client";

import { useState, useEffect } from "react";
import api from "../../lib/api";
import ArticleCard from "../../components/ArticleCard"; // We can reuse our card!
import { useAuth } from "../context/AuthContext";

// Define the Article type again for this page
type Article = {
  source: { name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
};

export default function BookmarksPage() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch bookmarks only if the user is logged in
    if (user) {
      const fetchBookmarks = async () => {
        try {
          setLoading(true);
          const response = await api.get("/articles/bookmarks");
          setBookmarks(response.data);
        } catch (error) {
          console.error("Failed to fetch bookmarks:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBookmarks();
    }
  }, [user]); // The effect depends on the user state

  if (loading) {
    return <p className="text-center mt-8">Loading bookmarks...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-center my-8 text-gray-800">
        My Bookmarks
      </h1>
      {bookmarks.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven&#39;t bookmarked any articles yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((article, index) => (
            <ArticleCard key={index} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
