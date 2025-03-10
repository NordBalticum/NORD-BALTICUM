import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FaPaperPlane, FaDownload, FaExchangeAlt, FaGem, FaHeart, FaSignOutAlt } from "react-icons/fa";
import styles from "@/styles/dashboard.module.css";
import Chart from "react-apexcharts";

// ✅ Dinaminis interaktyvus grafikas
const BalanceChart = dynamic(() => import("@/components/BalanceChart"), { ssr: false });

export default function Dashboard() {
  const { user, walletAddress, balances, logout, loading } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState("");
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "line",
      toolbar: { show: false },
      animations: { enabled: true },
    },
    xaxis: { categories: ["1d", "7d", "14d", "30d"] },
    colors: ["#FFD700"],
  });

  const [chartData, setChartData] = useState([{ name: "Balance", data: [1.2, 5.4, 10.7, 20.3] }]);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
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
      {/* ✅ HEADER */}
      <header className={styles.header}>
        <Image src="/logo.png" alt="Nord Balticum" width={220} height={60} className={styles.logo} />
        <button className={styles.logoutButton} onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </header>

      {/* ✅ DASHBOARD TURINYS */}
      <div className={styles.dashboardContent}>
        <h1 className={styles.title}>Welcome, {user.email.split("@")[0]}! 👑</h1>
        <p className={styles.subtitle}>Your Web3 financial hub.</p>

        {/* ✅ WALLET INFO */}
        <div className={styles.walletInfo}>
          <h2>💳 Wallet Address:</h2>
          <p className={styles.wallet}>{walletAddress || "Generating..."}</p>

          <h2>💰 Your Balance:</h2>
          <p className={styles.balance}>{balances ? `${balances} BNB` : "Fetching balance..."}</p>
        </div>

        {/* ✅ INTERAKTYVUS BALANCE CHART */}
        <div className={styles.balanceChart}>
          <h2>📊 Balance History</h2>
          <Chart options={chartOptions} series={chartData} type="line" height={300} />
        </div>

        {/* ✅ GREITI VEIKSMAI */}
        <div className={styles.quickActions}>
          <h2>🚀 Quick Actions</h2>
          <div className={styles.actionsGrid}>
            <button className={styles.actionButton} onClick={() => router.push("/send")}>
              <FaPaperPlane /> Send Crypto
            </button>
            <button className={styles.actionButton} onClick={() => router.push("/receive")}>
              <FaDownload /> Receive Funds
            </button>
            <button className={styles.actionButton} onClick={() => router.push("/swap")}>
              <FaExchangeAlt /> Swap Tokens
            </button>
            <button className={styles.actionButton} onClick={() => router.push("/stake")}>
              <FaGem /> Stake BNB
            </button>
            <button className={styles.donateButton} onClick={() => router.push("/donation")}>
              <FaHeart /> Donate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
