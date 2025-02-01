"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`p-2 rounded-lg ${
        theme === "dark" ? "bg-white" : "bg-gray-900"
      } shadow-md hover:shadow-lg transition-all relative flex items-center justify-center w-10`}
      aria-label="Toggle theme"
    >
      <Moon
        className={`h-5 w-5 transition-all ${
          theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
        } text-white`}
      />
      <Sun
        className={`h-5 w-5 transition-all absolute ${
          theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        } text-gray-900`}
      />
    </button>
  );
}
