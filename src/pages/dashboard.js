import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import styles from "@/styles/dashboard.module.css";
import Image from "next/image";

export default function Dashboard() {
  const { user, walletAddress, balances, logout, loading } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [user, loading]);

  const updateTime = () => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
  };

  if (loading || !user) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loader}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Image src="/logo.png" alt="Nord Balticum" width={180} height={50} className={styles.logo} />
        <button className={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      </header>

      <div className={styles.dashboardContent}>
        <h1 className={styles.title}>Welcome, {user.email.split("@")[0]}!</h1>
        <p className={styles.subtitle}>Your Web3 financial hub.</p>

        <div className={styles.walletInfo}>
          <h2>💳 Wallet Address:</h2>
          <p className={styles.wallet}>{walletAddress || "Generating..."}</p>

          <h2>💰 Your Balance:</h2>
          <p className={styles.balance}>
            {balances ? `${balances} BNB` : "Fetching balance..."}
          </p>
        </div>

        <div className={styles.quickActions}>
          <h2>🚀 Quick Actions</h2>
          <div className={styles.actionsGrid}>
            <button className={styles.actionButton} onClick={() => router.push("/send")}>
              ✈️ Send Crypto
            </button>
            <button className={styles.actionButton} onClick={() => router.push("/receive")}>
              📥 Receive Funds
            </button>
            <button className={styles.actionButton} onClick={() => router.push("/swap")}>
              🔄 Swap Tokens
            </button>
            <button className={styles.actionButton} onClick={() => router.push("/stake")}>
              💎 Stake BNB
            </button>
            <button className={styles.donateButton} onClick={() => router.push("/donation")}>
              ❤️ Donate
            </button>
          </div>
        </div>

        <div <footer className="footer">
          <p>Nord Balticum - {currentTime}</p>
        </div>
      </div>
    </div>
  );
}
