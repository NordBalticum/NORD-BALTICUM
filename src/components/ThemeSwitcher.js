import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="theme-switcher"
    >
      {theme === "dark" ? <FaSun /> : <FaMoon />}
    </button>
  );
}
