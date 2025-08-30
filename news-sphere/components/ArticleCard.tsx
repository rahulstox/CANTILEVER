// components/ArticleCard.tsx

import Image from "next/image";

// This defines the 'shape' of the props our component expects.
// We are only passing one prop: 'article'.
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

// This is our reusable component.
export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {article.urlToImage ? (
        <div className="relative h-48 w-full">
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill // This makes the image fill the container
            style={{ objectFit: "cover" }} // This is like 'background-size: cover'
            className="rounded-t-lg"
          />
        </div>
      ) : (
        // Fallback for when there is no image
        <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded-t-lg">
          <p className="text-gray-500">No Image Available</p>
        </div>
      )}

      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-gray-900 flex-grow">
          {article.title}
        </h2>
        <p className="text-gray-600 mt-2 text-sm">{article.description}</p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline mt-4 self-start"
        >
          Read more
        </a>
      </div>
    </div>
  );
}
