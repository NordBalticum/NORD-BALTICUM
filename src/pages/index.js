import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // ✅ Atnaujintas AuthContext kelias
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "@/styles/index.module.css";

// ✅ Teisingi logotipų ir ikonų importai
import logo from "/public/icons/logo.svg";
import walletIcon from "/public/icons/wallet-icon.svg";
import metamaskIcon from "/public/icons/metamask-icon.svg";
import emailIcon from "/public/icons/email-icon.svg";

export default function Home() {
  const { user, loginWithWallet, loginWithMetaMask, loginWithEmail, error, loading } = useAuth();
  const router = useRouter();

  // ✅ Automatinis nukreipimas į dashboard, jei vartotojas jau prisijungęs
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className={styles.container}>
      {/* ✅ PREMIUM HEADER */}
      <header className={styles.header}>
        <Image src={logo} alt="NordBalticum Logo" className={styles.logo} priority />
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
            <Image src={walletIcon} alt="WalletConnect" className={styles.buttonIcon} />
            <span>WalletConnect</span>
          </button>

          {/* MetaMask */}
          <button className={styles.walletButton} onClick={loginWithMetaMask} disabled={loading}>
            <Image src={metamaskIcon} alt="MetaMask" className={styles.buttonIcon} />
            <span>MetaMask</span>
          </button>

          {/* Email Magic Link */}
          <button className={styles.walletButton} onClick={() => {
            const email = prompt("Enter your email:");
            if (email) loginWithEmail(email);
          }} disabled={loading}>
            <Image src={emailIcon} alt="Email" className={styles.buttonIcon} />
            <span>Email Login</span>
          </button>
        </div>

        {/* ✅ STATUS PRANEŠIMAI */}
        {error && <p className={styles.error}>{error}</p>}
        {loading && <p className={styles.loading}>Processing...</p>}
      </div>
    </div>
  );
        }
