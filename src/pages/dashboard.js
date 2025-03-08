import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, formatEther, formatUnits } from "ethers";
import axios from "axios";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";
import Chart from "react-apexcharts";
import styles from "@/styles/dashboard.module.css";

const BSC_SCAN_API = process.env.NEXT_PUBLIC_BSC_SCAN_API;
const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";

export default function Dashboard() {
  const [bnbBalance, setBnbBalance] = useState("0");
  const [tokens, setTokens] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({
    series: [{ data: [0, 0, 0, 0] }],
    options: {
      chart: { type: "line", height: 250 },
      xaxis: { categories: ["1D", "7D", "14D", "30D"] },
    },
  });

  const router = useRouter();

  // ✅ Optimizuotas async funkcija adresų tikrinimui
  const fetchBalances = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      console.warn("MetaMask not detected.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const balance = await provider.getBalance(address);
      setBnbBalance(formatEther(balance));

      // Gauname visų tokenų balansą iš BscScan API
      const tokenRes = await axios.get(
        `https://api.bscscan.com/api?module=account&action=tokenbalance&address=${address}&apikey=${BSC_SCAN_API}`
      );

      if (tokenRes.data.status === "1" && Array.isArray(tokenRes.data.result)) {
        const formattedTokens = tokenRes.data.result.map(token => ({
          tokenName: token.tokenName,
          tokenSymbol: token.tokenSymbol,
          balance: formatUnits(token.balance || "0", token.tokenDecimal),
        }));
        setTokens(formattedTokens);
      }

      // Užkrauname balanso istoriją grafikui
      let { data, error } = await supabase
        .from("balances")
        .select("amount")
        .order("created_at", { ascending: false })
        .limit(4);
      if (!error) {
        setChartData(prev => ({
          ...prev,
          series: [{ data: data.map(item => Number(item.amount)) }],
        }));
      }

      // Užkrauname paskutines operacijas
      let { data: txData, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      if (!txError) {
        setTransactions(txData);
      }
    } catch (error) {
      console.error("Failed to fetch balances", error);
    }
  }, []);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return (
    <div className={styles.dashboardContainer}>
      <h1>Dashboard</h1>

      <div className={styles.balanceBox}>
        <h2>BNB Balance</h2>
        <p>{bnbBalance} BNB</p>
      </div>

      <Chart options={chartData.options} series={chartData.series} type="line" height={250} />

      <div className={styles.tokenList}>
        <h2>Your Tokens</h2>
        {tokens.length > 0 ? (
          tokens.map((token, index) => (
            <div key={index} className={styles.tokenItem}>
              <span>{token.tokenName}</span>
              <span>{token.balance} {token.tokenSymbol}</span>
            </div>
          ))
        ) : (
          <p>No tokens found</p>
        )}
      </div>

      <h2>Recent Transactions</h2>
      <table className={styles.transactionTable}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((tx, index) => (
              <tr key={index}>
                <td>{tx.type}</td>
                <td>{tx.amount} BNB</td>
                <td>{new Date(tx.created_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.dashboardButtons}>
        <button onClick={() => router.push("/send")}>Send</button>
        <button onClick={() => router.push("/receive")}>Receive</button>
        <button onClick={() => router.push("/stake")}>Stake</button>
        <button onClick={() => router.push("/swap")}>Swap</button>
        <button onClick={() => router.push("/donate")}>Donate</button>
      </div>
    </div>
  );
}
