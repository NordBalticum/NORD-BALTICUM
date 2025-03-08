import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { supabase } from "@/loginsystem/supabaseClient";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET; // Admin fee wallet

export default function Swap() {
  const [walletAddress, setWalletAddress] = useState("");
  const [swapUrl, setSwapUrl] = useState("");

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

    // 1inch Swap Interface – Users select pairs themselves
    setSwapUrl(`https://app.1inch.io/#/56/simple/swap/BNB/USDT`);
  }, []);

  async function handleFee(amount) {
    if (!walletAddress || !amount) return;

    let feePercentage = 0.2; // 0.2% swap fee
    let feeAmount = (amount * feePercentage) / 100;

    // Send fee to Admin Wallet
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    await signer.sendTransaction({
      to: ADMIN_WALLET,
      value: ethers.utils.parseEther(feeAmount.toString()),
    });

    // Store swap data in Supabase
    await supabase.from("swaps").insert([
      {
        user: walletAddress,
        amount: amount,
        fee: feeAmount,
        transaction_time: new Date().toISOString(),
      },
    ]);

    alert("Swap fee paid – You can now proceed with your swap.");
  }

  return (
    <div className="swap-container">
      <h1>Swap BNB & Tokens</h1>
      <p>Use the 1inch aggregator to get the best swap rates.</p>

      <div className="swap-iframe-container">
        <iframe src={swapUrl} title="1inch Swap" className="swap-iframe"></iframe>
      </div>

      <button onClick={() => handleFee(1)}>Pay Swap Fee (Auto 0.2%)</button>
    </div>
  );
}
