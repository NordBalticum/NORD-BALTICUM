import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "@/loginsystem/supabaseClient";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  return (
    <nav className="navbar">
      <span className="nav-logo" onClick={() => router.push("/dashboard")}>
        Nord Balticum
      </span>
      <div className="nav-menu">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/settings">Settings</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <ThemeSwitcher />
      <div className="nav-mobile">
        <button onClick={toggleMenu}>{isOpen ? "Close" : "Menu"}</button>
      </div>
      {isOpen && (
        <div className="mobile-menu">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/settings">Settings</Link>
        </div>
      )}
    </nav>
  );
}
