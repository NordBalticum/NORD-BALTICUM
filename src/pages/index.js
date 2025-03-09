import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/index.module.css";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { loginWithWallet, loginWithEmail, user } = useAuth();
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
    if (user) router.push("/dashboard");
  }, [user, router]);

  return (
    <div className={styles.container}>
      {/* ✅ LOGOTIPAS */}
      <img src="/logo.png" alt="Nord Balticum Logo" className={styles.logo} />

      {/* ✅ ANTRAŠTĖ */}
      <h1 className={styles.title}>
        Welcome to <br />
        <span className={styles.highlight}>Nord Balticum</span>
      </h1>

      {/* ✅ PAAIŠKINIMAS */}
      <p className={styles.subtitle}>
        The most advanced Web3 financial ecosystem.
      </p>

      {/* ✅ LOGIN MYGTUKAI */}
      <div className={styles.buttonContainer}>
        <button className={styles.walletconnect} onClick={loginWithWallet}>
          <img src="/walletconnect.png" alt="WalletConnect" className={styles.buttonIcon} />
        </button>

        <button className={styles.metamask} onClick={loginWithWallet}>
          <img src="/metamask.png" alt="MetaMask" className={styles.buttonIcon} />
        </button>

        <button className={styles.email} onClick={() => loginWithEmail(prompt("Enter your email"))}>
          <img src="/email.png" alt="Email Login" className={styles.emailIcon} />
          EMAIL LOGIN
        </button>
      </div>

      {/* ✅ PREMIUM FUNKCIJOS */}
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
