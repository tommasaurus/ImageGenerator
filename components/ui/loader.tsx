"use client";

import { motion } from "framer-motion";

const generateText = "GENERATING".split("");

export function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center">
        {/* Main loader animation */}
        <motion.div
          className="relative w-24 h-24"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          {/* Middle ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-white/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          {/* Inner ring with gradient */}
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-tr from-white/5 to-white/20"
            animate={{ rotate: -360, scale: [1, 1.1, 1] }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          {/* Center dot */}
          <motion.div
            className="absolute inset-[14px] rounded-full bg-white/10 backdrop-blur-md"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Animated text */}
        <div className="mt-12 flex items-center gap-[2px]">
          {generateText.map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                repeat: Infinity,
                repeatDelay: 2,
                duration: 0.3,
              }}
              className="text-white/70 text-sm font-light tracking-[0.2em]"
            >
              {letter}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="ml-1 text-white/70"
          >
            ●
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
