"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type HistoryItem = {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
};

export function ImageHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Temporary: Set some placeholder data for UI testing
    setHistory([
      {
        id: "1",
        prompt: "Sample image 1",
        imageUrl: "https://via.placeholder.com/512",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        prompt: "Sample image 2",
        imageUrl: "https://via.placeholder.com/512",
        createdAt: new Date().toISOString(),
      },
    ]);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No images generated yet. Start by generating your first image!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {history.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="relative aspect-square">
            <Image
              src={item.imageUrl}
              alt={item.prompt}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600 line-clamp-2">{item.prompt}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
