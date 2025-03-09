import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import "@/styles/navbar.css";
import "@/styles/themeswitcher.css";

export default function Navbar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link href="/">
          <Image src="/public/logo.png" alt="Nord Balticum Logo" width={160} height={50} priority />
        </Link>
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

        {user ? (
          <>
            <li><Link href="/profile">Profile</Link></li>
            <li><Link href="/settings">Settings</Link></li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <li>
            <Link href="/auth/login">
              <button className="login-btn">Login</button>
            </Link>
          </li>
        )}

        <li>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </li>
      </ul>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </nav>
  );
}
