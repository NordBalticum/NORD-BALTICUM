import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { useRouter } from "next/router";
import Chart from "chart.js/auto";
import "@/styles/dashboard.css";

const BSC_SCAN_API = process.env.NEXT_PUBLIC_BSC_SCAN_API;
const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";

export default function Dashboard() {
  const [bnbBalance, setBnbBalance] = useState("0");
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchBalances() {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      const provider = new ethers.providers.JsonRpcProvider(BSC_RPC_URL);
      const signer = provider.getSigner();

      try {
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        setBnbBalance(ethers.utils.formatEther(balance));

        // Gauname visų tokenų balansą iš BscScan
        const tokenRes = await axios.get(
          `https://api.bscscan.com/api?module=account&action=tokenbalance&address=${address}&apikey=${BSC_SCAN_API}`
        );

        if (tokenRes.data.status === "1") {
          setTokens(tokenRes.data.result);
        }
      } catch (error) {
        console.error("Failed to fetch balances", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBalances();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {loading ? (
        <p>Loading balances...</p>
      ) : (
        <>
          <div className="balance-box">
            <h2>BNB Balance</h2>
            <p>{bnbBalance} BNB</p>
          </div>

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

          <div className="buttons-group">
            <button onClick={() => router.push("/send")}>Send</button>
            <button onClick={() => router.push("/receive")}>Receive</button>
            <button onClick={() => router.push("/stake")}>Stake</button>
            <button onClick={() => router.push("/swap")}>Swap</button>
            <button onClick={() => router.push("/donate")}>Donate</button>
          </div>

          <div className="chart-container">
            <canvas id="balanceChart"></canvas>
          </div>
        </>
      )}
    </div>
  );
}
