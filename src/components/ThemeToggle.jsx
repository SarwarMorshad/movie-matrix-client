import { useEffect, useState } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Get theme from localStorage or default to dark
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;

    if (newTheme === "light") {
      // Light theme colors
      root.style.setProperty("--bg-base-100", "#ffffff");
      root.style.setProperty("--bg-base-200", "#f3f4f6");
      root.style.setProperty("--bg-base-300", "#e5e7eb");
      root.style.setProperty("--text-primary", "#111827");
      root.style.setProperty("--text-secondary", "#4b5563");
      root.style.setProperty("--border-color", "#d1d5db");

      document.body.classList.remove("dark");
      document.body.classList.add("light");
    } else {
      // Dark theme colors (default)
      root.style.setProperty("--bg-base-100", "#0A0A0A");
      root.style.setProperty("--bg-base-200", "#141414");
      root.style.setProperty("--bg-base-300", "#1F1F1F");
      root.style.setProperty("--text-primary", "#ffffff");
      root.style.setProperty("--text-secondary", "#9ca3af");
      root.style.setProperty("--border-color", "rgba(255, 255, 255, 0.1)");

      document.body.classList.remove("light");
      document.body.classList.add("dark");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-circle btn-ghost text-white hover:bg-white/10"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <MdLightMode className="text-2xl text-yellow-400" />
      ) : (
        <MdDarkMode className="text-2xl text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
