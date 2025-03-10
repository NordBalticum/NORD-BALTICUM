import { useState } from "react";
import { useAuth } from "@/login/AuthProvider";
import styles from "@/styles/index.module.css";
import Image from "next/image";

export default function Home() {
  const { loginWithWallet, loginWithMetaMask, loginWithEmail, loading, error } = useAuth();
  const [email, setEmail] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <Image src="/icons/logo.png" alt="NordBalticum" width={200} height={50} className={styles.logo} />

        <h1 className={styles.title}>Sign In</h1>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonContainer}>
          <button className={styles.walletButton} onClick={loginWithWallet} disabled={loading}>
            <Image src="/icons/walletconnect.svg" alt="WalletConnect" width={50} height={50} />
          </button>

          <button className={styles.walletButton} onClick={loginWithMetaMask} disabled={loading}>
            <Image src="/icons/metamask.svg" alt="MetaMask" width={50} height={50} />
          </button>

          <div className={styles.emailContainer}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.emailInput}
            />
            <button onClick={() => loginWithEmail(email)} className={styles.emailButton} disabled={loading}>
              Magic Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
