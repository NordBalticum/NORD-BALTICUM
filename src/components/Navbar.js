import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "@/styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Automatiškai atpažįsta, ar vartotojas prisijungęs
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  return (
    <nav className={`navbar ${theme}`}>
      <div className="nav-logo" onClick={() => router.push("/dashboard")}>
        NordBaltic Wallet
      </div>

      <div className="nav-links">
        <a onClick={() => router.push("/dashboard")}>Dashboard</a>
        <a onClick={() => router.push("/send")}>Send</a>
        <a onClick={() => router.push("/receive")}>Receive</a>
        <a onClick={() => router.push("/stake")}>Stake</a>
        <a onClick={() => router.push("/swap")}>Swap</a>
        <a onClick={() => router.push("/donate")}>Donate</a>
      </div>

      <div className="nav-actions">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        {user ? (
          <div className="dropdown">
            <button onClick={() => setIsOpen(!isOpen)}>⚙️</button>
            {isOpen && (
              <div className="dropdown-menu">
                <a onClick={() => router.push("/profile")}>Profile</a>
                <a onClick={() => router.push("/settings")}>Settings</a>
                <a onClick={() => router.push("/admin")}>Admin</a>
                <a onClick={logout}>Logout</a>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={() => router.push("/login")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
