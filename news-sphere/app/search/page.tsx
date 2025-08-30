// app/search/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "../../lib/api";
import ArticleCard from "../../components/ArticleCard";

type Article = {
  source: { name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
};

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const fetchSearchResults = async () => {
        try {
          setLoading(true);
          const response = await api.get("/news/search", {
            params: { q: query },
          });
          setArticles(response.data);
        } catch (error) {
          console.error("Failed to fetch search results:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSearchResults();
    }
  }, [query]);

  if (loading) {
    return <p className="text-center mt-8">Searching for &quot;{query}&quot;...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold my-8 text-gray-800">
        Search Results for &quot;{query}&quot;
      </h1>
      {articles.length === 0 ? (
        <p className="text-center text-gray-500">
          No articles found for your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={index} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

// Wrap the component in Suspense for client-side data fetching
export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
