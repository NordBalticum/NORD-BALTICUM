import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import styles from "@/styles/themeswitcher.component.css";
import styles from "@/styles/buttons.module.css";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <button
      className="theme-switcher"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <FaSun className="icon sun" /> : <FaMoon className="icon moon" />}
    </button>
  );
};

export default ThemeSwitcher;
