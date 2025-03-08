import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "../styles/index.module.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className={styles.indexContainer}>
      <h1 className={styles.indexTitle}>
        Welcome to <span className={styles.highlight}>Nord Balticum</span>
      </h1>
      <p className={styles.indexText}>The most advanced Web3 financial ecosystem.</p>

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

      <div className={styles.features}>
        <div className={styles.featureBox}>
          <h3 className={styles.featureTitle}>🛡️ Secure</h3>
          <p className={styles.featureText}>Bank-grade encryption for all transactions.</p>
        </div>
        <div className={styles.featureBox}>
          <h3 className={styles.featureTitle}>⚡ Fast</h3>
          <p className={styles.featureText}>Instant transactions on Binance Smart Chain.</p>
        </div>
        <div className={styles.featureBox}>
          <h3 className={styles.featureTitle}>🌍 Global</h3>
          <p className={styles.featureText}>Seamless payments worldwide.</p>
        </div>
      </div>

      <p className={styles.footer}>© 2025 Nord Balticum. The Future of Web3 Finance.</p>
    </div>
  );
}
