import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { supabase } from "@/loginsystem/supabaseClient";

const ADMIN_WALLET = "0xYOUR_ADMIN_WALLET"; // Pakeisti į realų admin wallet adresą

export default function Stake() {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [lockPeriod, setLockPeriod] = useState("30d");

  useEffect(() => {
    async function loadWallet() {
      if (!window.ethereum) return;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    }
    loadWallet();
  }, []);

  async function handleStake() {
    if (!walletAddress || !amount) return;

    let feePercentage = lockPeriod === "1y" ? 1 : lockPeriod === "180d" ? 2 : lockPeriod === "90d" ? 3 : 4;
    let feeAmount = (amount * feePercentage) / 100;
    let finalStake = amount - feeAmount;

    // Pervesti fee į admin wallet
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    await signer.sendTransaction({
      to: ADMIN_WALLET,
      value: ethers.utils.parseEther(feeAmount.toString()),
    });

    // Peradresuoti į 1inch staking puslapį su vartotojo pasirinkimu
    window.open(`https://app.1inch.io/#/staking`, "_blank");

    await supabase.from("staking").insert([
      {
        user: walletAddress,
        amount: finalStake,
        fee: feeAmount,
        lock_period: lockPeriod,
        timestamp: new Date(),
      },
    ]);

    alert("Staking initialized. Complete the process on 1inch.");
  }

  return (
    <div className="stake-container">
      <h1>Stake Your BNB</h1>
      <p>Select a staking provider on 1inch and earn rewards</p>

      <input
        type="number"
        placeholder="Amount (BNB)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select value={lockPeriod} onChange={(e) => setLockPeriod(e.target.value)}>
        <option value="30d">30 Days (4% Fee)</option>
        <option value="90d">90 Days (3% Fee)</option>
        <option value="180d">180 Days (2% Fee)</option>
        <option value="1y">1 Year (1% Fee)</option>
      </select>

      <button onClick={handleStake}>Stake Now</button>
    </div>
  );
}
