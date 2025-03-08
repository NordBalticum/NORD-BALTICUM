import { useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/settings.css";

export default function Settings() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
