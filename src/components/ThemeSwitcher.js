import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import "../styles/themeSwitcher.css";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button className="theme-switcher" onClick={toggleTheme}>
      {theme === "dark" ? <FaSun className="icon" /> : <FaMoon className="icon" />}
    </button>
  );
}
