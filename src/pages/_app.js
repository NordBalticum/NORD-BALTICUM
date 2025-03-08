import "@/styles/globals.css";
import "@/styles/theme.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const hideNavbar = router.pathname === "/"; // Paslepia Navbar index.js puslapyje

  return (
    <AuthProvider>
      <ThemeProvider>
        {!hideNavbar && <Navbar />} {/* Navbar rodomas visur, išskyrus index.js */}
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}
