"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import styles from "@/styles/imageGenerator.module.css";
import { motion, AnimatePresence } from "framer-motion";

interface GeneratedImage {
  id: number;
  url: string;
  prompt: string;
}

interface ImageGeneratorProps {
  onGenerating: Dispatch<SetStateAction<boolean>>;
}

// Placeholder images for testing
const placeholderImages = [
  "/images/ai-image-1.jpg",
  "/images/ai-image-2.jpg",
  "/images/ai-image-3.webp",
  "/images/ai-image-4.jpg",
  "/images/ai-image-5.avif",
];

// Add some initial test images
const initialImages: GeneratedImage[] = [
  {
    id: 0,
    url: placeholderImages[0],
    prompt: "A fiery phoenix",
  },
  {
    id: 1,
    url: placeholderImages[1],
    prompt: "Abstract landscape",
  },
  {
    id: 2,
    url: placeholderImages[2],
    prompt: "Digital artwork",
  },
  {
    id: 3,
    url: placeholderImages[3],
    prompt: "Cosmic scene",
  },
];

export function ImageGenerator({ onGenerating }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>(initialImages); // Initialize with test images
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Add console log to check images state
  useEffect(() => {
    console.log("Current images:", images);
    console.log("Current index:", currentImageIndex);
  }, [images, currentImageIndex]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    onGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newImage = {
      id: images.length,
      url: placeholderImages[images.length % placeholderImages.length],
      prompt: prompt,
    };

    const updatedImages = [...images, newImage];
    setImages(updatedImages);
    setCurrentImageIndex(updatedImages.length - 1);
    setIsGenerating(false);
    setPrompt("");
    setIsViewerOpen(true);
    onGenerating(false);
  };

  const handleReset = () => {
    setIsViewerOpen(false);
    setPrompt("");
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <AnimatePresence>
        {isViewerOpen && images.length > 0 && (
          <>
            {/* Full screen backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            />

            {/* Image gallery container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="fixed inset-x-0 top-24 bottom-40 z-40 flex flex-col items-center justify-center px-8 gap-4"
            >
              {/* Close button - moved to top right */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={handleReset}
                className="absolute top-0 right-8 bg-black/30 backdrop-blur-md hover:bg-black/50 text-white px-4 py-2 rounded-full transition-colors flex items-center gap-2 text-sm"
              >
                <span>Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
              </motion.button>

              {/* Centered prompt */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/30 backdrop-blur-md px-6 py-2 rounded-full text-white max-w-2xl text-center mx-auto"
              >
                <span className="text-gray-400 mr-2">Prompt:</span>
                <span className="font-medium">
                  {images[currentImageIndex]?.prompt}
                </span>
              </motion.div>

              {/* Image carousel */}
              <div className="relative w-full max-w-7xl flex items-center justify-center">
                {/* Previous image */}
                <div className="absolute -left-20 z-10">
                  {currentImageIndex > 0 && images.length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 0.5, x: 0 }}
                      className="relative w-64 h-64 rounded-xl overflow-hidden cursor-pointer hover:opacity-100 transition-all transform hover:scale-105"
                      onClick={() => handleImageClick(currentImageIndex - 1)}
                    >
                      <Image
                        src={images[currentImageIndex - 1].url}
                        alt="Previous image"
                        fill
                        className="object-cover blur-[2px] hover:blur-0 transition-all duration-300"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Current image */}
                {images[currentImageIndex] && (
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full max-w-4xl h-[60vh] rounded-2xl overflow-hidden mx-auto"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={images[currentImageIndex].url}
                        alt="Generated image"
                        fill
                        className="object-contain rounded-xl"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Next image */}
                <div className="absolute -right-20 z-10">
                  {currentImageIndex < images.length - 1 &&
                    images.length > 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 0.5, x: 0 }}
                        className="relative w-64 h-64 rounded-xl overflow-hidden cursor-pointer hover:opacity-100 transition-all transform hover:scale-105"
                        onClick={() => handleImageClick(currentImageIndex + 1)}
                      >
                        <Image
                          src={images[currentImageIndex + 1].url}
                          alt="Next image"
                          fill
                          className="object-cover blur-[2px] hover:blur-0 transition-all duration-300"
                        />
                      </motion.div>
                    )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Prompt Input */}
      <div className={`${styles.promptContainer} z-50`}>
        <motion.div
          className={styles.promptBar}
          animate={{
            scale: isGenerating ? 0.98 : 1,
            opacity: isGenerating ? 0.8 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className={styles.input}
            placeholder="Describe the image you want to generate..."
            disabled={isGenerating}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={styles.generateButton}
          >
            {isGenerating ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
              >
                <span className={styles.spinner} />
                Generating...
              </motion.div>
            ) : (
              "Generate Image"
            )}
          </button>
        </motion.div>
      </div>
    </>
  );
}
