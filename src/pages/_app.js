import "@/styles/globals.css";
import "@/styles/theme.css";
import "@/styles/navbar.css";
import "@/styles/themeswitcher.css";
import "@/styles/buttons.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const hideNavbar = router.pathname === "/"; // Paslepia Navbar tik index.js puslapyje
  
  return (
    <AuthProvider>
      <ThemeProvider>
        {!hideNavbar && <Navbar />}
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </AuthProvider>
  );
}
