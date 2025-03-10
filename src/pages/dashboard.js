import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // ✅ NAUDOJA AUTHCONTEXT
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "@/styles/dashboard.module.css";
import logo from '/icons/logo.svg';
import logoutIcon from '/icons/logout.svg';
import walletIcon from '/icons/wallet-icon.svg';

export default function Dashboard() {
  const { user, walletAddress, balance, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className={styles.container}>
      {/* ✅ HEADER */}
      <header className={styles.header}>
        <Image src={logo} alt="NordBalticum Logo" className={styles.logo} priority />
        <button className={styles.logoutButton} onClick={logout}>
          <Image src={logoutIcon} alt="Logout" className={styles.logoutIcon} />
        </button>
      </header>

      {/* ✅ DASHBOARD TURINYS */}
      <div className={styles.dashboardContent}>
        <h1 className={styles.title}>Welcome, {user?.email || "User"} 👑</h1>

        {/* ✅ WALLET INFO */}
        <div className={styles.walletInfo}>
          <h2 className={styles.walletTitle}>Your Wallet</h2>
          <p className={styles.walletAddress}>
            <Image src={walletIcon} alt="Wallet" className={styles.walletIcon} />
            {walletAddress || "Not Connected"}
          </p>
          <p className={styles.balance}>Balance: {loading ? "Loading..." : `${balance} BNB`}</p>
        </div>

        {/* ✅ GREITI VEIKSMAI */}
        <div className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            <button className={styles.actionButton}>Deposit</button>
            <button className={styles.actionButton}>Withdraw</button>
            <button className={styles.actionButton}>Swap</button>
            <button className={styles.donateButton}>Donate</button>
          </div>
        </div>
      </div>
    </div>
  );
}
