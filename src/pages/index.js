import { useEffect } from "react";
import { useAuth } from "@/login/AuthProvider";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "@/styles/index.module.css";
import logo from "/icons/logo.svg";
import walletIcon from "/icons/wallet-icon.svg";
import metamaskIcon from "/icons/metamask-icon.svg";
import emailIcon from "/icons/email-icon.svg";

export default function Home() {
  const auth = useAuth(); // ✅ APSAUGOTA NUO NULL
  const router = useRouter();

  useEffect(() => {
    if (auth?.user) {
      router.push("/dashboard");
    }
  }, [auth?.user, router]);

  if (!auth) {
    return <p className={styles.loading}>Loading...</p>; // ✅ APSAUGA NUO NULL
  }

  return (
    <div className={styles.container}>
      {/* ✅ HEADER */}
      <header className={styles.header}>
        <Image src={logo} alt="NordBalticum Logo" className={styles.logo} priority />
      </header>

      {/* ✅ LOGIN BLOKAS */}
      <div className={styles.loginBox}>
        <h2 className={styles.loginTitle}>Login with your preferred method</h2>

        {/* ✅ LOGIN MYGTUKAI */}
        <div className={styles.buttonContainer}>
          <button className={styles.walletButton} onClick={auth.loginWithWallet} disabled={auth.loading}>
            <Image src={walletIcon} alt="WalletConnect" className={styles.buttonIcon} />
          </button>

          <button className={styles.walletButton} onClick={auth.loginWithMetaMask} disabled={auth.loading}>
            <Image src={metamaskIcon} alt="MetaMask" className={styles.buttonIcon} />
          </button>

          <button className={styles.walletButton} onClick={() => {
            const email = prompt("Enter your email:");
            if (email) auth.loginWithEmail(email);
          }} disabled={auth.loading}>
            <Image src={emailIcon} alt="Email" className={styles.buttonIcon} />
          </button>
        </div>

        {/* ✅ STATUS PRANEŠIMAI */}
        {auth.error && <p className={styles.error}>{auth.error}</p>}
        {auth.loading && <p className={styles.loading}>Processing...</p>}
      </div>
    </div>
  );
        }
