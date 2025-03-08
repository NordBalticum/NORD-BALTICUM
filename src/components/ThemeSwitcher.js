import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import "../styles/themeswitcher.css";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <button className="theme-switcher" onClick={toggleTheme} aria-label="Toggle Theme">
      {theme === "dark" ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default ThemeSwitcher;
