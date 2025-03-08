import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import "@/styles/navbar.css";

export default function Navbar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="navbar">
      {/* 🔥 LOGOTIPAS */}
      <div className="logo">
        <Link href="/">
          <Image 
            src="/images/logo.svg" // DABAR PILNAI PALAIKO SVG
            alt="Nord Balticum Logo" 
            width={180} 
            height={55} 
            priority
          />
        </Link>
      </div>

      {/* 🔥 NAVIGACIJOS MENIU */}
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

      {/* 🔥 MOBILIOJO MENIU PERJUNGIMAS */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </nav>
  );
}
