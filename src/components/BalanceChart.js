import "@/styles/balancechart.module.css
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function BalanceChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const API_KEY = process.env.NEXT_PUBLIC_BSC_SCAN_API_KEY; // ✅ Iš .env failo
      const walletAddress = process.env.NEXT_PUBLIC_WALLET_ADDRESS; // ✅ Automatinis prisitaikymas
      const url = `https://api.bscscan.com/api?module=account&action=balance&address=${walletAddress}&apikey=${API_KEY}`;

      try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.status === "1") {
          const balance = parseFloat(result.result) / 10 ** 18;
          setData((prevData) => [...prevData, { time: new Date().toLocaleTimeString(), balance }]);
        }
      } catch (error) {
        console.error("Error fetching balance data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // ✅ Atnaujina kas minutę
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chartContainer">
      <h2 className="chartTitle">📊 Balance History</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="balance" stroke="#FFD700" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
