import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/index.module.css";

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }
  }, []);

  if (!isClient) return null;

  return (
    <div className={styles.container}>
      <div className={styles.glowOverlay}></div> {/* Neon glow efektas */}

      <h1 className={styles.title}>
        Welcome to <span className={styles.highlight}>Nord Balticum</span>
      </h1>
      <p className={styles.subtitle}>The most advanced Web3 financial ecosystem.</p>

      <div className={styles.ctaButtons}>
        <button
          className={`${styles.ctaButton} ${styles.primary}`}
          onClick={() => router.push("/auth/login")}
        >
          🚀 Login with Wallet
        </button>
        <button
          className={`${styles.ctaButton} ${styles.secondary}`}
          onClick={() => router.push("/auth/signup")}
        >
          ✉️ Sign up with Email
        </button>
      </div>

      <footer className={styles.footer}>
        <p>© 2025 Nord Balticum. The Future of Web3 Finance.</p>
      </footer>
    </div>
  );
}
