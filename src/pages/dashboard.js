import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";
import Chart from "react-apexcharts";
import { Buttons } from "@/components/Buttons";
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

  useEffect(() => {
    async function fetchBalances() {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      const provider = new ethers.providers.JsonRpcProvider(BSC_RPC_URL);

      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const address = accounts[0];

        const balance = await provider.getBalance(address);
        setBnbBalance(ethers.utils.formatEther(balance));

        // Gauname visų tokenų balansą iš BscScan API
        const tokenRes = await axios.get(
          `https://api.bscscan.com/api?module=account&action=tokenbalance&address=${address}&apikey=${BSC_SCAN_API}`
        );

        if (tokenRes.data.status === "1") {
          setTokens(tokenRes.data.result);
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
            series: [{ data: data.map(item => item.amount) }],
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
    }

    fetchBalances();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="balance-box">
        <h2>BNB Balance</h2>
        <p>{bnbBalance} BNB</p>
      </div>

      <Chart options={chartData.options} series={chartData.series} type="line" height={250} />

      <div className="token-list">
        <h2>Your Tokens</h2>
        {tokens.length > 0 ? (
          tokens.map((token, index) => (
            <div key={index} className="token-item">
              <span>{token.tokenName}</span>
              <span>{ethers.utils.formatUnits(token.balance, token.tokenDecimal)} {token.tokenSymbol}</span>
            </div>
          ))
        ) : (
          <p>No tokens found</p>
        )}
      </div>

      <h2>Recent Transactions</h2>
      <table className="transaction-table">
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

      <div className="dashboard-buttons">
        <Button text="Send" onClick={() => router.push("/send")} />
        <Button text="Receive" onClick={() => router.push("/receive")} />
        <Button text="Stake" onClick={() => router.push("/stake")} />
        <Button text="Swap" onClick={() => router.push("/swap")} />
        <Button text="Donate" onClick={() => router.push("/donate")} />
      </div>
    </div>
  );
}
