import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import styles from "@/styles/balancechart.module.css";

// ✅ API KEY IR WALLET ADRESAS DABAR NAUDOJAMI IŠ .ENV FAILO
const API_KEY = process.env.NEXT_PUBLIC_BSCSCAN_API_KEY; 
const WALLET_ADDRESS = process.env.NEXT_PUBLIC_WALLET_ADDRESS;

export default function BalanceChart() {
  const [chartData, setChartData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  useEffect(() => {
    fetchBalanceHistory(selectedPeriod);
  }, [selectedPeriod]);

  const fetchBalanceHistory = async (period) => {
    try {
      const response = await fetch(
        `https://api.bscscan.com/api?module=account&action=balancehistory&address=${WALLET_ADDRESS}&apikey=${API_KEY}`
      );
      const data = await response.json();

      if (data.status === "1" && data.result) {
        const formattedData = data.result.map((entry) => ({
          period: new Date(entry.timestamp * 1000).toLocaleDateString(),
          value: parseFloat(entry.balance) / 10 ** 18, // Convert from Wei to BNB
        }));

        setChartData(formattedData);
      } else {
        console.error("API error:", data.message);
      }
    } catch (error) {
      console.error("Fetch balance history error:", error);
    }
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>📊 Balance History</h3>

      {/* ✅ PERIOD SELECTOR */}
      <div className={styles.periodSelector}>
        {["1d", "7d", "14d", "30d"].map((period) => (
          <button
            key={period}
            className={selectedPeriod === period ? styles.active : ""}
            onClick={() => setSelectedPeriod(period)}
          >
            {period.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ✅ CHART */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <XAxis dataKey="period" stroke="#FFF8E1" />
          <YAxis stroke="#FFF8E1" />
          <Tooltip contentStyle={{ background: "#212BFF", color: "#FFF8E1", borderRadius: "8px" }} />
          <Line type="monotone" dataKey="value" stroke="#FFD700" strokeWidth={3} dot={{ fill: "#FFD700", r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
