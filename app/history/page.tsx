"use client";

import Link from "next/link";
import { ImageHistory } from "@/components/ImageHistory";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Generation History
            </h1>
            <Link
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Generate New Image
            </Link>
          </div>

          <ImageHistory />
        </div>
      </main>
    </div>
  );
}
