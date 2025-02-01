"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Search, X, Download } from "lucide-react";

type HistoryItem = {
  id: string;
  prompt: string;
  image_url: string;
  storage_path: string;
  created_at: string;
};

export function ImageHistory() {
  const [images, setImages] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<HistoryItem | null>(null);
  const { theme } = useTheme();

  // Fetch images when component mounts
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/images");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch images");
        }

        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Filter images based on search query
  const filteredImages = images.filter((image) =>
    image.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add download function
  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Create filename from prompt (clean it up and limit length)
      const filename = `${prompt
        .slice(0, 30)
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}.png`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-5">
      {/* Search bar */}
      <div className="relative mb-8">
        <div className="glass-panel-search rounded-2xl shadow-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 
              ${
                theme === "dark"
                  ? "bg-white/5 text-white placeholder:text-gray-400"
                  : "bg-gray-100 text-gray-900 placeholder:text-gray-500"
              }
              backdrop-blur-lg 
              border border-gray-200/20 
              rounded-2xl
              focus:outline-none focus:ring-2 focus:ring-primary/50
              transition-all duration-300`}
          />
        </div>
      </div>

      {isLoading ? (
        // Show loading skeleton while fetching
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 p-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 p-1">
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(image)}
              className="relative aspect-square group cursor-pointer"
            >
              <Image
                src={image.image_url}
                alt={image.prompt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                <p className="text-white text-sm line-clamp-2">
                  {image.prompt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Image popup */}
      <AnimatePresence>
        {selectedImage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/80 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 md:inset-20 z-50 flex flex-col items-center justify-center"
            >
              <div className="relative w-full h-full max-w-5xl mx-auto">
                {/* Move buttons inside the image container */}
                <div className="absolute top-4 right-32 flex gap-2 z-50">
                  {/* Download button */}
                  <button
                    onClick={() =>
                      handleDownload(
                        selectedImage.image_url,
                        selectedImage.prompt
                      )
                    }
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <Download className="w-6 h-6" />
                  </button>
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <Image
                  src={selectedImage.image_url}
                  alt={selectedImage.prompt}
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
              <div
                className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 
                ${theme === "dark" ? "bg-black/50" : "bg-white/70"} 
                backdrop-blur-sm px-6 py-3 rounded-full`}
              >
                <p
                  className={`text-center ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {selectedImage.prompt}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!isLoading && filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            {searchQuery
              ? "No images found matching your search"
              : "No images in your history yet"}
          </p>
        </div>
      )}
    </div>
  );
}
