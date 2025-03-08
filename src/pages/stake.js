import { useState } from "react";
import { ethers } from "ethers";
import { supabase } from "../supabaseClient";
import "../styles/stake.css";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;
const STAKE_CONTRACT = process.env.NEXT_PUBLIC_STAKE_CONTRACT;

export default function Stake() {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("1y");
  const [loading, setLoading] = useState(false);

  const stakeTokens = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    try {
      const address = await signer.getAddress();
      const contract = new ethers.Contract(STAKE_CONTRACT, STAKE_ABI, signer);

      let feePercentage;
      switch (duration) {
        case "1y":
          feePercentage = 1;
          break;
        case "6m":
          feePercentage = 2;
          break;
        case "90d":
          feePercentage = 3;
          break;
        default:
          feePercentage = 4;
      }

      const feeAmount = (amount * feePercentage) / 100;
      const stakeAmount = amount - feeAmount;

      const tx = await contract.stakeTokens(ethers.utils.parseEther(stakeAmount.toString()), duration);
      await tx.wait();

      await supabase.from("stakes").insert([{ user: address, amount: stakeAmount, duration }]);

      alert("Staking successful!");
    } catch (error) {
      console.error("Staking failed", error);
    }
    setLoading(false);
  };

  return (
    <div className="stake-container">
      <h1>Stake Your Tokens</h1>
      <input type="number" placeholder="Amount in BNB" value={amount} onChange={(e) => setAmount(e.target.value)} />
      
      <select value={duration} onChange={(e) => setDuration(e.target.value)}>
        <option value="1y">1 Year (1% Fee)</option>
        <option value="6m">6 Months (2% Fee)</option>
        <option value="90d">90 Days (3% Fee)</option>
        <option value="flexible">Anytime Withdraw (4% Fee)</option>
      </select>
      
      <button onClick={stakeTokens} disabled={loading}>
        {loading ? "Processing..." : "Stake"}
      </button>
    </div>
  );
}
