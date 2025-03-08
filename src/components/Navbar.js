import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/loginsystem/supabaseClient";
import { HiOutlineMenu, HiOutlineX, HiMoon, HiSun } from "react-icons/hi";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (router.pathname === "/") return null; // Paslėpti Navbar iš Onboarding puslapio

  return (
    <nav className="navbar">
      <div className="nav-container">
        <span className="nav-logo" onClick={() => router.push("/dashboard")}>
          Nord Balticum
        </span>

        {/* Desktop Menu */}
        <div className="nav-menu">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/send">Send</Link>
          <Link href="/receive">Receive</Link>
          <Link href="/stake">Stake</Link>
          <Link href="/swap">Swap</Link>
          <Link href="/donate">Donate</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/settings">Settings</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
          <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
            {darkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="nav-mobile">
          <button onClick={() => setIsOpen(!isOpen)} className="menu-button">
            {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mobile-menu">
          <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link href="/send" onClick={() => setIsOpen(false)}>Send</Link>
          <Link href="/receive" onClick={() => setIsOpen(false)}>Receive</Link>
          <Link href="/stake" onClick={() => setIsOpen(false)}>Stake</Link>
          <Link href="/swap" onClick={() => setIsOpen(false)}>Swap</Link>
          <Link href="/donate" onClick={() => setIsOpen(false)}>Donate</Link>
          <Link href="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
          <Link href="/settings" onClick={() => setIsOpen(false)}>Settings</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
          <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
            {darkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
          </button>
        </div>
      )}
    </nav>
  );
}
