// components/Header.tsx
"use client";

import Link from "next/link";
import { useAuth } from "../app/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggleButton } from "./ThemeToggleButton"; // Make sure this is imported

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Optional: clear search bar after search
    }
  };

  return (
    // 1. Added dark mode classes here
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          // 2. Added dark mode text color
          className="text-3xl font-extrabold text-gray-800 dark:text-white"
        >
          NewsSphere
        </Link>

        <form onSubmit={handleSearch} className="w-1/3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            // 3. Added dark mode styles for the input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </form>

        {/* The <nav> element now also works as a container for the user actions and theme toggle */}
        <nav className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/bookmarks"
                // 4. Added dark mode text color for links
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                My Bookmarks
              </Link>
              <span className="text-gray-700 dark:text-gray-300">
                Welcome, {user.name}!
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Register
              </Link>
            </div>
          )}
          {/* 5. The Theme Toggle Button is added here, at the end of the nav */}
          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
}
