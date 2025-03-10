import "@/styles/balancechart.module.css";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function BalanceChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const API_KEY = process.env.NEXT_PUBLIC_BSC_SCAN_API_KEY;
      const walletAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS;

      if (!API_KEY || !walletAddress) {
        console.error("🚨 API KEY arba WALLET ADDRESS trūksta!");
        return;
      }

      try {
        const response = await fetch(`https://api.bscscan.com/api?module=account&action=balance&address=${walletAddress}&apikey=${API_KEY}`);
        const result = await response.json();

        if (result.status === "1") {
          const balance = parseFloat(result.result) / 10 ** 18;
          const newData = { time: new Date().toLocaleTimeString(), balance };

          setData((prevData) => [...prevData.slice(-9), newData]);
          console.log("📊 Nauja balanso reikšmė:", balance);
        }
      } catch (error) {
        console.error("❌ Klaida gaunant balanso duomenis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chartContainer">
      <h2 className="chartTitle">📊 Balance History</h2>
      {loading ? (
        <p className="loadingText">🔄 Loading balance data...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="time" stroke="#FFD700" />
            <YAxis domain={["auto", "auto"]} stroke="#FFF8E1" />
            <Tooltip />
            <Line type="monotone" dataKey="balance" stroke="#FFD700" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
