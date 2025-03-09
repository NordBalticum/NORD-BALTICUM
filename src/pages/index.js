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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) router.push("/dashboard");
  }, []);

  return (
    <div className={styles.container}>
      {/* ✅ PREMIUM LOGOTIPO VIETA */}
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Nord Balticum" className={styles.logo} />
        <p className={styles.slogan}>
          The most advanced Web3 financial ecosystem.
        </p>
      </div>

      {/* ✅ MYGTUKAI */}
      <div className={styles.buttonGroup}>
        <button className={`${styles.loginButton} ${styles.walletButton}`} onClick={() => router.push("/login/loginwagmi")}>
          <img src="/walletconnect.png" alt="WalletConnect" className={styles.icon} />
        </button>

        <button className={`${styles.loginButton} ${styles.metamaskButton}`} onClick={() => router.push("/login/loginweb3")}>
          <img src="/metamask.png" alt="MetaMask" className={styles.icon} />
        </button>

        <button className={`${styles.loginButton} ${styles.emailButton}`} onClick={() => router.push("/login/loginemail")}>
          <img src="/email.png" alt="Email Login" className={styles.icon} />
          <span>EMAIL LOGIN</span>
        </button>
      </div>

      {/* ✅ FUNKCIJŲ KORTELĖS */}
      <div className={styles.features}>
        <div className={styles.featureCard}>
          <h2>🛡️ Secure</h2>
          <p>Bank-grade encryption for all transactions.</p>
        </div>
        <div className={styles.featureCard}>
          <h2>⚡ Fast</h2>
          <p>Instant transactions on Binance Smart Chain.</p>
        </div>
      </div>
      <div className={styles.featureCardCenter}>
        <h2>🌍 Global</h2>
        <p>Seamless payments worldwide.</p>
      </div>
    </div>
  );
}
