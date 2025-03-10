import { useEffect } from "react";
import { useAuth } from "@/login/AuthProvider";
import { useRouter } from "next/router";
import styles from "@/styles/index.module.css";

const logo = "/icons/logo.svg";
const walletIcon = "/icons/wallet-icon.svg";
const metamaskIcon = "/icons/metamask-icon.svg";
const emailIcon = "/icons/email-icon.svg";

export default function Home() {
  const { user, loginWithWallet, loginWithMetaMask, loginWithEmail, error, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className={styles.container}>
      {/* ✅ PREMIUM HEADER */}
      <header className={styles.header}>
        <img src={logo} alt="NordBalticum Logo" className={styles.logo} />
      </header>

      {/* ✅ TITULAS */}
      <h1 className={styles.title}>Welcome to NordBalticum</h1>
      <p className={styles.subtitle}>The Ultimate Web3 Banking Experience</p>

      {/* ✅ LOGIN BLOKAS */}
      <div className={styles.loginBox}>
        <h2 className={styles.loginTitle}>Login with your preferred method</h2>

        {/* ✅ LOGIN MYGTUKAI */}
        <div className={styles.buttonContainer}>
          {/* WalletConnect */}
          <button className={styles.walletButton} onClick={loginWithWallet} disabled={loading}>
            <img src={walletIcon} alt="WalletConnect" className={styles.buttonIcon} />
          </button>

          {/* MetaMask */}
          <button className={styles.walletButton} onClick={loginWithMetaMask} disabled={loading}>
            <img src={metamaskIcon} alt="MetaMask" className={styles.buttonIcon} />
          </button>

          {/* Email Magic Link */}
          <button
            className={styles.walletButton}
            onClick={() => {
              const email = prompt("Enter your email:");
              if (email) loginWithEmail(email);
            }}
            disabled={loading}
          >
            <img src={emailIcon} alt="Email" className={styles.buttonIcon} />
          </button>
        </div>

        {/* ✅ STATUS PRANEŠIMAI */}
        {error && <p className={styles.error}>{error}</p>}
        {loading && <p className={styles.loading}>Processing...</p>}
      </div>
    </div>
  );
        }
