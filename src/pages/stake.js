import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { supabase } from "@/loginsystem/supabaseClient";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET; // Taken from Vercel `.env`

export default function Stake() {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [lockPeriod, setLockPeriod] = useState("30d");
  const [stakingUrl, setStakingUrl] = useState("");

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

    // 1inch Staking Page iframe – users select their pool
    setStakingUrl(`https://app.1inch.io/#/staking?network=56`);
  }, []);

  async function handleStake() {
    if (!walletAddress || !amount) return;

    let feePercentage = lockPeriod === "1y" ? 1 : lockPeriod === "180d" ? 2 : lockPeriod === "90d" ? 3 : 4;
    let feeAmount = (amount * feePercentage) / 100;
    let finalStake = amount - feeAmount;

    // Transaction to send fee to the Admin Wallet
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    await signer.sendTransaction({
      to: ADMIN_WALLET,
      value: ethers.utils.parseEther(feeAmount.toString()),
    });

    // Store staking data in Supabase
    await supabase.from("staking").insert([
      {
        user: walletAddress,
        amount: finalStake,
        fee: feeAmount,
        lock_period: lockPeriod,
        transaction_time: new Date().toISOString(),
      },
    ]);
    
    alert("Fee deducted, now choose your staking pool!");
  }

  return (
    <div className="stake-container">
      <h1>Stake Your BNB</h1>
      <p>Select a staking pool from 1inch and stake your BNB</p>

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

      <button onClick={handleStake}>Pay Fee & Choose Staking Pool</button>

      <div className="staking-iframe-container">
        <iframe src={stakingUrl} title="1inch Staking" className="staking-iframe"></iframe>
      </div>
    </div>
  );
}
