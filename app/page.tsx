"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageGenerator } from "@/components/ImageGenerator";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@/styles/home.module.css";
import { useState } from "react";

export default function HomePage() {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen hero-gradient">
      <nav className="fixed top-0 w-full z-40 glass-panel">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className={`font-bold text-xl ${styles.navLink}`}>
              ImageMart
            </Link>
            <Link href="/history" className={styles.navLink}>
              History
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <main className="h-screen overflow-hidden pt-20">
        <div className="container mx-auto px-4">
          <AnimatePresence>
            {!isGenerating && (
              <motion.div
                className="relative h-[calc(100vh-5rem)] flex items-center justify-center"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Center image behind text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 rounded-3xl overflow-hidden opacity-20 blur-sm">
                    <Image
                      src="/images/ai-image-1.jpg"
                      alt="Background Art"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Floating images */}
                <motion.div className="absolute inset-0">
                  <div className="relative w-full h-full">
                    {/* Top left - horizontal image */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="absolute top-[-2%] left-[11%] w-80 h-52 rounded-3xl overflow-hidden transform -rotate-6 shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-500"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 z-10" />
                      <Image
                        src="/images/ai-image-2.jpg"
                        alt="AI Generated Art"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </motion.div>

                    {/* Top right - square image */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute top-[0%] right-[10%] w-56 h-56 rounded-3xl overflow-hidden transform rotate-6 shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-500"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 z-10" />
                      <Image
                        src="/images/ai-image-3.webp"
                        alt="AI Generated Art"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </motion.div>

                    {/* Middle left - vertical image */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="absolute top-[42%] left-[-3%] w-80 h-72 rounded-3xl overflow-hidden transform rotate-12 shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-500"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 z-10" />
                      <Image
                        src="/images/ai-image-4.jpg"
                        alt="AI Generated Art"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </motion.div>

                    {/* Middle right - vertical image */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute top-[40%] right-[0%] w-48 h-64 rounded-3xl overflow-hidden transform -rotate-12 shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-500"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 z-10" />
                      <Image
                        src="/images/ai-image-5.avif"
                        alt="AI Generated Art"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Central text content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative z-10 text-center"
                >
                  <h1 className={styles.title}>
                    <span>Image</span>
                    <span>M</span>
                    <span className="animate-gradient-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 text-transparent bg-clip-text bg-gradient-300">
                      art
                    </span>
                  </h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className={styles.subtitle}
                  >
                    Transform your ideas into reality
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <ImageGenerator onGenerating={setIsGenerating} />
    </div>
  );
}
