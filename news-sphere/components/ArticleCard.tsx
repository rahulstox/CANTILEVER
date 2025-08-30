// components/ArticleCard.tsx
"use client";

import Image from "next/image";
import { useAuth } from "../app/context/AuthContext";
import api from "../lib/api";

type Article = {
  source: { name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
};

type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const { user } = useAuth();

  const handleBookmark = async () => {
    if (!user) {
      alert("Please log in to bookmark articles.");
      return;
    }
    try {
      const response = await api.post("/articles/bookmark", article);
      console.log("Bookmarked!", response.data);
      alert("Article bookmarked successfully!");
    } catch (error) {
      console.error("Failed to bookmark article:", error);
      alert("Failed to bookmark article.");
    }
  };

  return (
    // -> Added dark mode styles for background and border
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {article.urlToImage ? (
        <div className="relative h-48 w-full">
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-lg"
          />
        </div>
      ) : (
        // -> Added dark mode styles for the fallback
        <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-t-lg">
          <p className="text-gray-500 dark:text-gray-400">No Image Available</p>
        </div>
      )}

      <div className="p-5 flex flex-col flex-grow">
        {/* -> Added dark mode text color */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex-grow">
          {article.title}
        </h2>
        {/* -> Added dark mode text color */}
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
          {article.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline self-start"
          >
            Read more
          </a>
          {user && (
            <button
              onClick={handleBookmark}
              // -> Added dark mode styles for the button
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 font-bold py-1 px-3 rounded"
            >
              Bookmark
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
