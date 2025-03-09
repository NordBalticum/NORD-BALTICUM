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
    // Jei vartotojas jau prisijungęs, peradresuojame į dashboard
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) router.push("/dashboard");
  }, []);

  return (
    <div className={styles.container}>
      {/* ✅ LOGOTIPAS */}
      <img src="/logo.png" alt="Nord Balticum Logo" className={styles.logo} />

      {/* ✅ PAGRINDINĖ ANTRAŠTĖ */}
      <h1 className={styles.title}>
        Welcome to <br />
        <span className={styles.highlight}>Nord Balticum</span>
      </h1>

      {/* ✅ PAAIŠKINIMAS PO ANTRAŠTE */}
      <p className={styles.subtitle}>
        The most advanced Web3 financial ecosystem.
      </p>

      {/* ✅ LOGIN MYGTUKAI */}
      <div className={styles.buttonContainer}>
        <button
          className={styles.walletconnect}
          onClick={() => router.push("/login/loginwagmi")}
        >
          <img
            src="/walletconnect.png"
            alt="WalletConnect"
            className={styles.buttonIcon}
          />
        </button>

        <button
          className={styles.metamask}
          onClick={() => router.push("/login/loginweb3")}
        >
          <img
            src="/metamask.png"
            alt="MetaMask"
            className={styles.buttonIcon}
          />
        </button>

        <button
          className={styles.email}
          onClick={() => router.push("/login/loginemail")}
        >
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
