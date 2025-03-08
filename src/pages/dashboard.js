import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import Chart from "chart.js/auto";
import Image from "next/image";
import "@/styles/dashboard.css"; // Premium UI stiliai

export default function Dashboard() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [bnbPrice, setBnbPrice] = useState(null);
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
        const accounts = await provider.listAccounts();
        if (accounts.length === 0) {
          router.replace("/");
          return;
        }
        const balanceWei = await provider.getBalance(accounts[0]);
        const balanceEth = ethers.utils.formatEther(balanceWei);
        setBalance(balanceEth);

        // BNB kaina iš CoinGecko API
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd,eur");
        const data = await response.json();
        setBnbPrice(data.binancecoin);

        // Simuliuojame balanso istoriją grafikui
        setChartData({
          labels: ["1D", "7D", "14D", "30D"],
          datasets: [{
            label: "Balance History",
            data: [balanceEth * 0.98, balanceEth * 1.02, balanceEth * 0.95, balanceEth * 1.1],
            backgroundColor: "rgba(255, 215, 0, 0.2)",
            borderColor: "#FFD700",
            borderWidth: 2,
          }],
        });
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
    fetchData();
  }, [router]);

  return (
    <div className="dashboard-wrapper">
      <motion.div
        className="dashboard-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="dashboard-title">Your BSC Wallet</h1>

        {/* Balansas */}
        <div className="balance-card">
          <h2>Balance: {balance} BNB</h2>
          {bnbPrice && (
            <p>
              ≈ {parseFloat(balance * bnbPrice.usd).toFixed(2)} USD | {parseFloat(balance * bnbPrice.eur).toFixed(2)} EUR
            </p>
          )}
        </div>

        {/* Grafikas */}
        <div className="chart-container">
          <canvas id="balanceChart"></canvas>
        </div>

        {/* Mygtukai */}
        <div className="dashboard-buttons">
          <button className="btn send" onClick={() => router.push("/send")}>Send</button>
          <button className="btn receive" onClick={() => router.push("/receive")}>Receive</button>
          <button className="btn stake" onClick={() => router.push("/stake")}>Stake</button>
          <button className="btn swap" onClick={() => router.push("/swap")}>Swap</button>
          <button className="btn donate" onClick={() => router.push("/donate")}>Donate</button>
        </div>
      </motion.div>
    </div>
  );
}
