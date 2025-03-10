import { useEffect } from "react";
import { useAuth } from "@/login/AuthProvider";
import { useRouter } from "next/router";
import styles from "@/styles/index.module.css";

export default function Home() {
  const {
    user,
    loginWithWalletConnect,
    loginWithMetaMask,
    loginWithEmail,
    loading,
    error,
  } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <img src="/logo.png" alt="NordBalticum" className={styles.logo} />

        <h1 className={styles.title}>Welcome to NordBalticum</h1>

        <div className={styles.buttonContainer}>
          <button className={styles.walletButton} onClick={loginWithMetaMask}>
            <img src="/icons/metamask.svg" alt="MetaMask" className={styles.buttonIcon} />
            <span>MetaMask</span>
          </button>

          <button className={styles.walletButton} onClick={loginWithWalletConnect}>
            <img src="/icons/walletconnect.svg" alt="WalletConnect" className={styles.buttonIcon} />
            <span>WalletConnect</span>
          </button>

          <button className={styles.walletButton} onClick={() => {
            const email = prompt("Enter your email:");
            if (email) loginWithEmail(email);
          }}>
            <img src="/icons/email.svg" alt="Email Login" className={styles.buttonIcon} />
            <span>Email Login</span>
          </button>
        </div>

        {loading && <p className={styles.status}>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
        }
