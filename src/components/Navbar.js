import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import styles from "@/styles/navbar.module.css";
import "@/styles/themeswitcher.module.css";
import "@/styles/buttons.module.css";

export default function Navbar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.navScrolled : ""}`}>
      {/* ✅ LOGOTIPAS */}
      <div className={styles.navbarLogo}>
        <Link href="/">
          <Image src="/logo.png" alt="Nord Balticum Logo" width={180} height={55} priority />
        </Link>
      </div>

      {/* ✅ NAVIGACIJOS MENIU */}
      <ul className={`${styles.navLinks} ${menuOpen ? styles.menuOpen : ""}`}>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li className={styles.dropdown}>
          <span>Crypto Actions ▼</span>
          <ul className={styles.dropdownMenu}>
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
              <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <li>
            <Link href="/auth/login">
              <button className={styles.loginBtn}>Login</button>
            </Link>
          </li>
        )}

        {/* ✅ TEMOS PERJUNGIMAS */}
        <li>
          <button className={styles.themeSwitcher} onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </li>
      </ul>

      {/* ✅ MOBILUS MENIU TOGGLE */}
      <div className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </nav>
  );
}
