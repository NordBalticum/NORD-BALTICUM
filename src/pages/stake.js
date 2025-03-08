import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import "../styles/stake.css";
import { supabase } from "../supabaseClient";

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
      if (!window.ethereum) return;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      setBnbBalance(ethers.utils.formatEther(balance));
    }
    fetchBalance();
  }, []);

  async function handleStake() {
    if (!amount || parseFloat(amount) <= 0) return alert("Enter a valid amount");

    setLoading(true);
    try {
      const feePercentage = stakePeriod === "365" ? 1 : stakePeriod === "180" ? 2 : stakePeriod === "90" ? 3 : 4;
      const feeAmount = (parseFloat(amount) * feePercentage) / 100;
      const stakeAmount = parseFloat(amount) - feeAmount;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: ADMIN_WALLET,
        value: ethers.utils.parseEther(feeAmount.toString()),
      });

      setTxHash(tx.hash);

      // Stake per 1inch API
      const stakeTx = await axios.get(`${ONEINCH_API}stake`, {
        params: { amount: stakeAmount, duration: stakePeriod },
      });

      console.log("Staking Successful!", stakeTx.data);
    } catch (error) {
      console.error("Staking failed", error);
    }
    setLoading(false);
  }

  return (
    <div className="stake-container">
      <h1>Stake BNB</h1>
      <p>Balance: {bnbBalance} BNB</p>
      <input type="number" placeholder="Amount to Stake" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <select value={stakePeriod} onChange={(e) => setStakePeriod(e.target.value)}>
        <option value="365">1 Year (1% Fee)</option>
        <option value="180">6 Months (2% Fee)</option>
        <option value="90">3 Months (3% Fee)</option>
        <option value="30">Anytime Withdraw (4% Fee)</option>
      </select>
      <button onClick={handleStake} disabled={loading}>
        {loading ? "Staking..." : "Stake Now"}
      </button>
      {txHash && <p>Transaction: <a href={`https://bscscan.com/tx/${txHash}`} target="_blank">View on BscScan</a></p>}
    </div>
  );
}
