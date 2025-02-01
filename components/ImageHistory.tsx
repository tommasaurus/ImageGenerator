"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Search, Clock } from "lucide-react";

type HistoryItem = {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
};

const placeholderImages = [
  "/images/ai-image-1.jpg",
  "/images/ai-image-2.jpg",
  "/images/ai-image-3.webp",
  "/images/ai-image-4.jpg",
  "/images/ai-image-5.avif",
];

export function ImageHistory() {
  const { theme } = useTheme();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<HistoryItem | null>(null);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockHistory = Array.from({ length: 12 }, (_, i) => ({
        id: `${i + 1}`,
        prompt: [
          "A mystical forest at dawn",
          "Futuristic cityscape at night",
          "Abstract geometric patterns",
          "Underwater scene with bioluminescent creatures",
          "Cosmic nebula with vibrant colors",
        ][Math.floor(Math.random() * 5)],
        imageUrl: placeholderImages[i % placeholderImages.length],
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      }));
      setHistory(mockHistory);
      setIsLoading(false);
    }, 1500);
  }, []);

  const filteredHistory = history.filter((item) =>
    item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and filters */}
      <div className="sticky top-20 z-10 w-full">
        <div className="glass-panel rounded-2xl shadow-lg mx-auto">
          <div className="relative p-4">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-2 rounded-xl ${
                theme === "dark"
                  ? "bg-gray-800/50 text-white"
                  : "bg-white/50 text-gray-900"
              } border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all`}
            />
          </div>
        </div>
      </div>

      {/* Image grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredHistory.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative rounded-2xl overflow-hidden ${
                theme === "dark" ? "bg-gray-800/50" : "bg-white"
              } shadow-lg hover:shadow-xl transition-all`}
              onClick={() => setSelectedImage(item)}
            >
              <div className="aspect-square relative">
                <Image
                  src={item.imageUrl}
                  alt={item.prompt}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    theme === "dark" ? "from-black/70" : "from-black/50"
                  } to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  <div className="absolute bottom-0 p-4 w-full">
                    <p className="text-white text-sm line-clamp-2 font-medium">
                      {item.prompt}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-gray-300 text-xs">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Image preview modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedImage(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`relative z-10 w-full max-w-4xl rounded-3xl overflow-hidden backdrop-blur-sm m-6 ${
                theme === "dark"
                  ? "bg-gradient-to-b from-gray-900/50 to-black/50 border-white/10"
                  : "bg-gradient-to-b from-white/80 to-white/40 border-black/5"
              } border`}
            >
              {/* Action buttons */}
              <div className="absolute top-0 right-0 z-50 p-4 flex gap-2">
                {/* Download button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement("a");
                    link.href = selectedImage.imageUrl;
                    link.download = `${selectedImage.prompt.slice(0, 30)}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className={`p-2 rounded-full backdrop-blur-sm border transition-all group ${
                    theme === "dark"
                      ? "bg-black/50 text-white/90 hover:text-white hover:bg-black/70 border-white/10"
                      : "bg-white/50 text-black/70 hover:text-black hover:bg-white/70 border-black/10"
                  }`}
                  title="Download image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transform group-hover:translate-y-0.5 transition-transform"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>

                {/* Close button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                  className={`p-2 rounded-full backdrop-blur-sm border transition-all ${
                    theme === "dark"
                      ? "bg-black/50 text-white/90 hover:text-white hover:bg-black/70 border-white/10"
                      : "bg-white/50 text-black/70 hover:text-black hover:bg-white/70 border-black/10"
                  }`}
                  title="Close preview"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Content wrapper with padding */}
              <div className="p-6">
                {/* Image container */}
                <div
                  className={`relative w-full aspect-[16/9] rounded-2xl overflow-hidden
                  }`}
                >
                  <Image
                    src={selectedImage.imageUrl}
                    alt={selectedImage.prompt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                </div>

                {/* Prompt */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 text-center"
                >
                  <div
                    className={`inline-block px-6 py-3 rounded-2xl backdrop-blur-sm border ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10"
                        : "bg-black/5 border-black/5"
                    }`}
                  >
                    <p
                      className={
                        theme === "dark" ? "text-white/90" : "text-black/90"
                      }
                    >
                      {selectedImage.prompt}
                    </p>
                    <p
                      className={
                        theme === "dark" ? "text-white/50" : "text-black/50"
                      }
                    >
                      {new Date(selectedImage.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
