"use client";

import Link from "next/link";
import { ImageGenerator } from "@/components/ImageGenerator";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen hero-gradient">
      <nav className="fixed top-0 w-full z-40 glass-panel">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-white font-bold text-xl">
            ImageMart
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/history"
              className="text-white hover:text-blue-200 transition-colors"
            >
              History
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              ImageMart
              <span className="block">Generation</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Transform your ideas into stunning images with our free AI image
              generator
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Your image grid content */}
          </div>
        </div>
      </main>

      <ImageGenerator />
    </div>
  );
}
