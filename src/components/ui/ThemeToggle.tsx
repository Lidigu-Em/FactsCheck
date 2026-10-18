"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return (
      <div className="w-[68px] h-8 bg-gray-800/80 rounded-full border border-gray-700/60" />
    );
  }

  return (
    <div
      role="group"
      aria-label="Color theme switcher"
      className="inline-flex items-center bg-gray-800/90 hover:bg-gray-800 border border-gray-700/80 rounded-full p-0.5 shadow-inner transition-colors"
    >
      <button
        type="button"
        onClick={() => toggleTheme("light")}
        aria-label="Light mode"
        className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 ${
          theme === "light"
            ? "bg-amber-400 text-gray-900 shadow-sm"
            : "text-gray-400 hover:text-gray-200"
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => toggleTheme("dark")}
        aria-label="Dark mode"
        className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 ${
          theme === "dark"
            ? "bg-amber-400 text-gray-900 shadow-sm"
            : "text-gray-400 hover:text-gray-200"
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
