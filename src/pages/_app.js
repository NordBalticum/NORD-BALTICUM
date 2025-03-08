import "@/styles/globals.css";
import "@/styles/theme.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import { supabase } from "@/utils/supabaseClient";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const hideNavbar = router.pathname === "/"; // Paslepia Navbar tik index.js puslapyje

  return (
    <AuthProvider>
      <ThemeProvider>
        {!hideNavbar && <Navbar />}
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}
