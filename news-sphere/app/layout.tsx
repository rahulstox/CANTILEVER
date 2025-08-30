// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "../components/ThemeProvider"; // Your ThemeProvider component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NewsSphere - Your Daily News Aggregator",
  description: "Get the latest news from around the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Add suppressHydrationWarning to the <html> tag
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        {/* Wrap everything with ThemeProvider and pass the required props */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* AuthProvider goes inside the ThemeProvider */}
          <AuthProvider>
            {/* Add dark mode background class here */}
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
