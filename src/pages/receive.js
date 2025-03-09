import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "@/utils/supabaseClient";
import "@/styles/receive.module.css";

const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";

export default function Receive() {
  const [walletAddress, setWalletAddress] = useState("");
  const [bnbBalance, setBnbBalance] = useState("0");
  const [loading, setLoading] = useState(true);

  // ✅ Optimizuotas async fetch funkcija
  const fetchAddress = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask.");
      setLoading(false);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);

      const balance = await provider.getBalance(address);
      setBnbBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Failed to fetch wallet details", error);
      alert("Error fetching wallet details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  const copyToClipboard = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    alert("✅ Wallet address copied to clipboard!");
  };

  return (
    <div className={styles.receiveContainer}>
      <h1>Receive BNB & Tokens</h1>

      {loading ? (
        <p>Loading wallet details...</p>
      ) : (
        <>
          <p>Your Wallet Address:</p>
          <div className={styles.walletBox}>
            <span>{walletAddress || "No address found"}</span>
            <button onClick={copyToClipboard}>📋 Copy</button>
          </div>

          <h2>Your BNB Balance: {bnbBalance} BNB</h2>

          <div className={styles.qrCode}>
            {walletAddress ? (
              <QRCodeCanvas value={walletAddress} size={200} />
            ) : (
              <p>No QR Code Available</p>
            )}
          </div>

          {walletAddress && (
            <div className={styles.bscscanLink}>
              <a href={`https://bscscan.com/address/${walletAddress}`} target="_blank" rel="noopener noreferrer">
                View on BscScan 🔗
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
