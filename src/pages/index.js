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
      <img src="/logo.png" alt="Nord Balticum Logo" className={styles.logo} />
      <h1 className={styles.subtitle}>The most advanced Web3 financial ecosystem.</h1>

      <div className={styles.buttonContainer}>
        <button className={`${styles.loginButton} ${styles.walletconnect}`} onClick={() => router.push("/login/loginwagmi")}>
          <img src="/walletconnect.png" alt="WalletConnect" />
        </button>

        <button className={`${styles.loginButton} ${styles.metamask}`} onClick={() => router.push("/login/loginweb3")}>
          <img src="/metamask.png" alt="MetaMask" />
        </button>

        <button className={`${styles.loginButton} ${styles.email}`} onClick={() => router.push("/login/loginemail")}>
          <img src="/email.png" alt="Email Login" />
          EMAIL LOGIN
        </button>
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <h2>🛡️ Secure</h2>
          <p>Bank-grade encryption for all transactions.</p>
        </div>
        <div className={styles.featureCard}>
          <h2>🌍 Global</h2>
          <p>Seamless payments worldwide.</p>
        </div>
        <div className={styles.featureCard}>
          <h2>⚡ Fast</h2>
          <p>Instant transactions on Binance Smart Chain.</p>
        </div>
      </div>
    </div>
  );
}
