import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/index.module.css";

export default function Home() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
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
      {/* ✅ Premium antraštė */}
      <h1 className={styles.title}>
        Welcome to <br />
        <span className={styles.highlight}>Nord Balticum</span>
      </h1>
      <p className={styles.subtitle}>The most advanced Web3 financial ecosystem.</p>

      {/* 🚀 Login mygtukai */}
      <div className={styles.buttonGroup}>
        <button className={styles.walletButton} onClick={() => router.push("/login/loginwagmi")}>
          <img src="/walletconnect.png" alt="WalletConnect" className={styles.icon} />
          WalletConnect
        </button>

        <button className={styles.metamaskButton} onClick={() => router.push("/login/loginweb3")}>
          <img src="/metamask.png" alt="MetaMask" className={styles.icon} />
          MetaMask
        </button>

        <button className={styles.emailButton} onClick={() => router.push("/login/loginemail")}>
          <img src="/email.png" alt="Email Login" className={styles.icon} />
          Connect with Email
        </button>
      </div>

      {/* 🔥 Premium funkcijos */}
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

      {/* 🔹 Footer */}
      <p className={styles.footer}>© 2025 Nord Balticum. The Future of Web3 Finance.</p>
    </div>
  );
}
