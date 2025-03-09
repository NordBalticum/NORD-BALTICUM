import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/index.module.css";

export default function Home() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Welcome to <br />
        <span className={styles.highlight}>Nord Balticum</span>
      </h1>
      <p className={styles.subtitle}>The most advanced Web3 financial ecosystem.</p>

      <div className={styles.buttonGroup}>
        <button className={styles.walletButton} onClick={() => router.push("/login/wallet")}>
          🚀 LOGIN WITH WALLET
        </button>
        <button className={styles.emailButton} onClick={() => router.push("/login/email")}>
          ✉️ LOGIN WITH EMAIL
        </button>
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <h2>🛡️ Secure</h2>
          <p>Bank-grade encryption for all transactions.</p>
        </div>
        <div className={styles.featureCard}>
          <h2>⚡ Fast</h2>
          <p>Instant transactions on Binance Smart Chain.</p>
        </div>
        <div className={styles.featureCard}>
          <h2>🌍 Global</h2>
          <p>Seamless payments worldwide.</p>
        </div>
      </div>

      {/* ✅ Footeriui naudojame globalų variantą */}
    </div>
  );
}
