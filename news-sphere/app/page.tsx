// app/page.tsx

import ArticleCard from "../components/ArticleCard"; // <-- Import our new component

type Article = {
  source: { name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
};

async function getNews(): Promise<Article[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error("NEWS_API_KEY is not set in .env.local");
  }

  // A list of popular Indian news source IDs from NewsAPI
  const sources = "the-times-of-india,the-hindu,google-news-in";

  // Using the 'sources' parameter is more reliable than 'country'
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?sources=${sources}&apiKey=${apiKey}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  const data = await response.json();
  return data.articles || [];
}

export default async function HomePage() {
  const articles = await getNews();

  return (
    <main className="container mx-auto p-4">
      {articles.length === 0 ? (
        <p className="text-center text-gray-500">No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Now we just map and render our reusable component! */}
          {articles.map((article, index) => (
            <ArticleCard key={index} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
