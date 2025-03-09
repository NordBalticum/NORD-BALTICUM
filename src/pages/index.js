import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/index.module.css";

export default function Home() {
  const router = useRouter();
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") || "dark";
    setTheme(currentTheme);
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, []);

  return (
    <div className={styles.container}>
      {/* ✅ Logotipas su glow efektu */}
      <img src="/logo.png" alt="Nord Balticum" className={styles.logo} />

      {/* ✅ UI/UX tobulinimas */}
      <p className={styles.subtitle}>The most advanced Web3 financial system</p>

      <div className={styles.buttonContainer}>
        {/* ✅ WalletConnect mygtukas */}
        <button className={`${styles.loginButton} ${styles.walletconnect}`} onClick={() => router.push("/login/loginwagmi")}>
          <img src="/walletconnect.png" alt="WalletConnect" className={styles.icon} />
        </button>

        {/* ✅ MetaMask mygtukas */}
        <button className={`${styles.loginButton} ${styles.metamask}`} onClick={() => router.push("/login/loginweb3")}>
          <img src="/metamask.png" alt="MetaMask" className={styles.icon} />
        </button>

        {/* ✅ Email login mygtukas */}
        <button className={`${styles.loginButton} ${styles.email}`} onClick={() => router.push("/login/loginemail")}>
          <img src="/email.png" alt="Email" className={styles.icon} />
          <span>Email Login</span>
        </button>
      </div>

      {/* ✅ Prabangios lentelės */}
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
    </div>
  );
}
