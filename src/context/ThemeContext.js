import { createContext, useContext, useState, useEffect } from "react";

// ✅ Sukuriame kontekstą
const ThemeContext = createContext();

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
      return localStorage.getItem("theme") || "dark"; // ✅ Numatytoji tema – "dark"
    }
    return "dark";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Pasikeitus temai – išsaugo į `localStorage`
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  // ✅ Perjungia temą
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ Default eksportas, jei reikia importuoti visą kontekstą
export default ThemeContext;
