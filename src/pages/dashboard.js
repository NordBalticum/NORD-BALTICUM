import { useEffect } from "react";
import { useAuth } from "@/loginsystem/AuthProvider";
import { useRouter } from "next/router";
import styles from "@/styles/dashboard.module.css";

export default function Dashboard() {
  const { user, walletAddress, balance, logout, loading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/logo.png" alt="NordBalticum" className={styles.logo} />
        <button className={styles.logoutButton} onClick={logout}>Logout</button>
      </div>

      <div className={styles.walletInfo}>
        <h2>Wallet Information</h2>
        <p><strong>Address:</strong> {walletAddress || "Not Connected"}</p>
        <p><strong>Balance:</strong> {balance} BNB</p>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <button className={styles.actionButton}>Send</button>
          <button className={styles.actionButton}>Receive</button>
          <button className={styles.actionButton}>Swap</button>
          <button className={styles.actionButton}>Stake</button>
        </div>
      </div>

      {loading && <p className={styles.status}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
      }
