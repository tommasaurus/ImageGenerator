"use client";

import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import Image from "next/image";
import styles from "@/styles/imageGenerator.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "@/components/ui/loader";

interface GeneratedImage {
  id: string;
  prompt: string;
  image_url: string; // This is the Supabase storage URL
  storage_path: string;
  created_at: string;
}

interface ImageGeneratorProps {
  onGenerating: (isGenerating: boolean) => void;
}

export function ImageGenerator({ onGenerating }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Single preload function that doesn't update state
  const preloadSingleImage = useCallback((url: string) => {
    return new Promise<void>((resolve) => {
      if (!url) {
        resolve();
        return;
      }

      const img = document.createElement("img");
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Failed to load image: ${url}`);
        resolve();
      };
      img.src = url;
    });
  }, []);

  // Fetch images when component mounts
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/images");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch images");
        }

        // Filter and sort images
        const validImages = data
          .filter((img: GeneratedImage) => img.image_url && img.storage_path)
          .sort(
            (a: GeneratedImage, b: GeneratedImage) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );

        setImages(validImages);

        if (validImages.length > 0) {
          setCurrentImageIndex(0);
          // Preload first image and mark it as loaded
          await preloadSingleImage(validImages[0].image_url);
          setLoadedImages(new Set([validImages[0].image_url]));
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch images"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []); // Remove preloadImage dependency

  // Handle preloading of adjacent images
  useEffect(() => {
    if (!images.length) return;

    const preloadImages = async () => {
      try {
        const currentImage = images[currentImageIndex];
        if (!currentImage?.image_url) return;

        const urlsToPreload = new Set<string>();
        urlsToPreload.add(currentImage.image_url);

        if (currentImageIndex > 0) {
          urlsToPreload.add(images[currentImageIndex - 1].image_url);
        }
        if (currentImageIndex < images.length - 1) {
          urlsToPreload.add(images[currentImageIndex + 1].image_url);
        }

        // Preload all images and update state once
        await Promise.all(
          Array.from(urlsToPreload).map(async (url) => {
            if (!loadedImages.has(url)) {
              await preloadSingleImage(url);
              setLoadedImages((prev) => new Set([...prev, url]));
            }
          })
        );
      } catch (error) {
        console.warn("Error preloading images:", error);
      }
    };

    preloadImages();
  }, [currentImageIndex, images, loadedImages, preloadSingleImage]);

  // Update handleGenerate to use preloadSingleImage
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setIsImageLoading(true);
    setError(null);
    onGenerating(true);

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      const newImage: GeneratedImage = {
        id: data.id,
        prompt: data.prompt,
        image_url: data.image_url,
        storage_path: data.storage_path,
        created_at: data.created_at,
      };

      // Preload the new image
      await preloadSingleImage(newImage.image_url);
      setLoadedImages((prev) => new Set([...prev, newImage.image_url]));

      setImages((prev) => [newImage, ...prev]);
      setCurrentImageIndex(0);
      setIsViewerOpen(true);
      setPrompt("");
    } catch (error) {
      console.error("Error generating image:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate image"
      );
    } finally {
      setIsGenerating(false);
      setIsImageLoading(false);
      onGenerating(false);
    }
  };

  // Update handleImageClick to be more robust
  const handleImageClick = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) {
        setCurrentImageIndex(index);
      }
    },
    [images.length]
  );

  const handleReset = () => {
    setIsViewerOpen(false);
    setPrompt("");
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {(isGenerating || isImageLoading) && <Loader key="loader" />}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {error}
          </motion.div>
        )}

        {isViewerOpen && images.length > 0 && !isLoading && (
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
                {/* Previous image (newer images) */}
                <div className="absolute -left-20 z-10">
                  {currentImageIndex < images.length - 1 &&
                    images.length > 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 0.5, x: 0 }}
                        className="relative w-64 h-64 rounded-xl overflow-hidden cursor-pointer hover:opacity-100 transition-all transform hover:scale-105"
                        onClick={() => handleImageClick(currentImageIndex + 1)}
                      >
                        {loadedImages.has(
                          images[currentImageIndex + 1].image_url
                        ) && (
                          <Image
                            src={images[currentImageIndex + 1].image_url}
                            alt="Newer image"
                            fill
                            className="object-cover blur-[2px] hover:blur-0 transition-all duration-300"
                          />
                        )}
                      </motion.div>
                    )}
                </div>

                {/* Current image */}
                {loadedImages.has(images[currentImageIndex].image_url) && (
                  <motion.div
                    key={`image-${currentImageIndex}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative w-full max-w-4xl h-[60vh] rounded-2xl overflow-hidden mx-auto"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={images[currentImageIndex].image_url}
                        alt={images[currentImageIndex].prompt}
                        fill
                        className="object-contain rounded-xl"
                        priority
                      />
                    </div>
                  </motion.div>
                )}

                {/* Next image (older images) */}
                <div className="absolute -right-20 z-10">
                  {currentImageIndex > 0 && images.length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 0.5, x: 0 }}
                      className="relative w-64 h-64 rounded-xl overflow-hidden cursor-pointer hover:opacity-100 transition-all transform hover:scale-105"
                      onClick={() => handleImageClick(currentImageIndex - 1)}
                    >
                      {loadedImages.has(
                        images[currentImageIndex - 1].image_url
                      ) && (
                        <Image
                          src={images[currentImageIndex - 1].image_url}
                          alt="Older image"
                          fill
                          className="object-cover blur-[2px] hover:blur-0 transition-all duration-300"
                        />
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Prompt Input */}
      <div className={styles.promptContainer}>
        <motion.div
          className={styles.promptBar}
          animate={{
            scale: isGenerating ? 0.98 : 1,
            opacity: isGenerating ? 0.8 : 1,
          }}
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className={styles.input}
            placeholder="Describe the image you want to generate..."
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isGenerating && prompt.trim()) {
                handleGenerate();
              }
            }}
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
