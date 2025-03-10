import { useState, useEffect } from "react";
import { BrowserProvider, JsonRpcProvider, formatEther, parseEther } from "ethers";
import axios from "axios";
import { supabase } from "@/utils/supabaseClient";
import styles from "@/styles/stake.module.css";

const ONEINCH_API = "https://api.1inch.io/v5.0/56/";
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;

export default function Stake() {
  const [bnbBalance, setBnbBalance] = useState("0");
  const [amount, setAmount] = useState("");
  const [stakePeriod, setStakePeriod] = useState("365");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBalance() {
      if (typeof window === "undefined" || !window.ethereum) return;

      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        setBnbBalance(formatEther(balance));
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    }

    fetchBalance();
  }, []);

  async function handleStake() {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    if (!ADMIN_WALLET) {
      alert("Admin wallet address is not set. Please check your environment variables.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid staking amount.");
      return;
    }

    if (Number(amount) > Number(bnbBalance)) {
      alert("Insufficient BNB balance.");
      return;
    }

    setLoading(true);

    try {
      const stakeFeeRates = { "365": 1, "180": 2, "90": 3, "30": 4 };
      const feePercentage = stakeFeeRates[stakePeriod] || 4;
      const totalAmount = parseEther(amount);
      const feeAmount = totalAmount * BigInt(feePercentage) / BigInt(100);
      const stakeAmount = totalAmount - feeAmount;

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Siunčiame administracinį mokestį
      const feeTx = await signer.sendTransaction({
        to: ADMIN_WALLET,
        value: feeAmount,
      });

      setTxHash(feeTx.hash);

      // Stake operacija per 1inch API
      const stakeTx = await axios.get(`${ONEINCH_API}stake`, {
        params: { amount: formatEther(stakeAmount), duration: stakePeriod },
      });

      console.log("Staking Successful!", stakeTx.data);
      alert("Staking Successful!");

    } catch (error) {
      console.error("Staking failed:", error);
      alert("Staking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.stakeContainer}>
      <h1>Stake BNB</h1>
      <p>Balance: {bnbBalance} BNB</p>

      <input 
        type="number" 
        placeholder="Amount to Stake" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
        min="0.01"
        step="0.01"
      />

      <select value={stakePeriod} onChange={(e) => setStakePeriod(e.target.value)}>
        <option value="365">1 Year (1% Fee)</option>
        <option value="180">6 Months (2% Fee)</option>
        <option value="90">3 Months (3% Fee)</option>
        <option value="30">Anytime Withdraw (4% Fee)</option>
      </select>

      <button onClick={handleStake} disabled={loading}>
        {loading ? "Staking..." : "Stake Now"}
      </button>

      {txHash && (
        <p>
          Transaction:{" "}
          <a href={`https://bscscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
            View on BscScan
          </a>
        </p>
      )}
    </div>
  );
}
