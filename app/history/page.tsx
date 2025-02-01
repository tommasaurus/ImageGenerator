"use client";

import Link from "next/link";
import { ImageHistory } from "@/components/ImageHistory";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HistoryPage() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300 overflow-auto`}
    >
      {/* Navigation bar */}
      <nav className="fixed top-0 w-full z-50 glass-panel">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Generator
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1
              className={`text-4xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Your Creations
            </h1>
            <p
              className={`mt-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Browse through your generated masterpieces
            </p>
          </motion.div>

          <ImageHistory />
        </div>
      </main>
    </div>
  );
}
