"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "@/styles/imageGenerator.module.css";
import { motion, AnimatePresence } from "framer-motion";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Temporary: Set a placeholder image for UI testing
    setGeneratedImage("https://via.placeholder.com/512");
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    // TODO: Implement download functionality
    window.open(generatedImage, "_blank");
  };

  return (
    <div className={styles.promptContainer}>
      <div className={styles.promptBar}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className={styles.input}
          placeholder="Describe the image you want to generate..."
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className={styles.generateButton}
        >
          {isGenerating ? (
            <>
              <span className={styles.spinner} />
              Generating...
            </>
          ) : (
            "Generate Image"
          )}
        </button>
      </div>
    </div>
  );
}
