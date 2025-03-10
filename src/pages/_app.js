import "@/styles/globals.css";
import "@/styles/theme.css";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  
  return (
    <AuthProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}
