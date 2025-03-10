import { useEffect, useState } from "react";
import { useAuth } from "@/login/AuthProvider";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "@/styles/index.module.css";

export default function Home() {
  const auth = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth && auth.user) {
      router.push("/dashboard");
    } else {
      setIsLoading(false); // ✅ Užbaigiama įkrovimo būsena
    }
  }, [auth, auth?.user, router]);

  if (isLoading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      {/* ✅ HEADER */}
      <header className={styles.header}>
        <Image src="/icons/logo.svg" alt="NordBalticum Logo" width={150} height={150} priority />
      </header>

      {/* ✅ LOGIN BLOKAS */}
      <div className={styles.loginBox}>
        <h2 className={styles.loginTitle}>Login with your preferred method</h2>

        {/* ✅ LOGIN MYGTUKAI */}
        <div className={styles.buttonContainer}>
          <button className={styles.walletButton} onClick={auth?.loginWithWallet} disabled={auth?.loading}>
            <Image src="/icons/wallet-icon.svg" alt="WalletConnect" width={50} height={50} />
          </button>

          <button className={styles.walletButton} onClick={auth?.loginWithMetaMask} disabled={auth?.loading}>
            <Image src="/icons/metamask-icon.svg" alt="MetaMask" width={50} height={50} />
          </button>

          <button className={styles.walletButton} onClick={() => {
            const email = prompt("Enter your email:");
            if (email) auth?.loginWithEmail(email);
          }} disabled={auth?.loading}>
            <Image src="/icons/email-icon.svg" alt="Email" width={50} height={50} />
          </button>
        </div>

        {/* ✅ STATUS PRANEŠIMAI */}
        {auth?.error && <p className={styles.error}>{auth.error}</p>}
        {auth?.loading && <p className={styles.loading}>Processing...</p>}
      </div>
    </div>
  );
        }
