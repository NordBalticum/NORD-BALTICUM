import { useEffect, useState } from "react";
import { useAuth } from "@/login/AuthProvider";
import { supabase } from "@/utils/supabaseClient";
import { ethers } from "ethers";
import styles from "@/styles/dashboard.module.css";

export default function Dashboard() {
  const { user, walletAddress, balance, logout, error } = useAuth();
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (walletAddress) {
      fetchRecentTransactions();
    }
  }, [walletAddress]);

  const fetchRecentTransactions = async () => {
    try {
      setLoading(true);
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      const history = await provider.getHistory(walletAddress);

      const transactions = history.slice(-5).map((tx) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: ethers.utils.formatEther(tx.value),
        timestamp: new Date(tx.timestamp * 1000).toLocaleString(),
      }));

      setRecentTransactions(transactions);
    } catch (err) {
      console.error("❌ Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/logo.png" alt="Logo" className={styles.logo} />
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div className={styles.walletInfo}>
        <h2>Your Wallet</h2>
        <p><strong>Address:</strong> {walletAddress || "N/A"}</p>
        <p><strong>Balance:</strong> {balance} BNB</p>
      </div>

      <div className={styles.balanceChart}>
        <h2>Recent Transactions</h2>
        {loading ? (
          <p>Loading transactions...</p>
        ) : recentTransactions.length > 0 ? (
          <ul>
            {recentTransactions.map((tx, index) => (
              <li key={index}>
                <span><strong>From:</strong> {tx.from}</span><br />
                <span><strong>To:</strong> {tx.to}</span><br />
                <span><strong>Amount:</strong> {tx.value} BNB</span><br />
                <span><strong>Time:</strong> {tx.timestamp}</span><br />
                <a href={`https://bscscan.com/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
                  View on BscScan
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
      }
