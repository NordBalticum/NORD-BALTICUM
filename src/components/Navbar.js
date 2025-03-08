import { useState } from "react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import "@/styles/navbar.css";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-content">
        <div className="logo">
          <Link href="/">NORD BALTICUM</Link>
        </div>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <ul className={`menu ${menuOpen ? "open" : ""}`}>
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li className="dropdown">
            <span>Crypto Actions ▼</span>
            <ul className="dropdown-menu">
              <li><Link href="/send">Send</Link></li>
              <li><Link href="/receive">Receive</Link></li>
              <li><Link href="/stake">Stake</Link></li>
              <li><Link href="/swap">Swap</Link></li>
              <li><Link href="/donate">Donate</Link></li>
            </ul>
          </li>
          <li><Link href="/profile">Profile</Link></li>
          <li><Link href="/settings">Settings</Link></li>
          <li>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
