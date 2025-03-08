import { createContext, useContext, useState, useEffect } from "react";

// ✅ Sukuriame kontekstą
const ThemeContext = createContext(null);

// ✅ Custom hook, kad būtų galima naudoti `useTheme()`
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// ✅ ThemeProvider komponentas
export const ThemeProvider = ({ children }) => {
  // Patikrina, ar vartotojas jau turi išsaugotą temą
  const getInitialTheme = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || 
             (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); // ✅ Automatinis perėmimas iš sistemos nustatymų
    }
    return "dark";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Pasikeitus temai – išsaugo į `localStorage` ir pritaiko klasę prie `documentElement`
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  // ✅ Perjungia temą su animacija
  const toggleTheme = () => {
    document.documentElement.classList.add("theme-transition"); // Sklandus perėjimas
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    setTimeout(() => document.documentElement.classList.remove("theme-transition"), 500); // Po pusės sekundės išjungiam transition klasę
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ Default eksportas, jei reikia importuoti visą kontekstą
export default ThemeContext;
