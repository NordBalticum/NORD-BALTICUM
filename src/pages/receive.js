import { useState, useEffect } from "react";
import { ethers } from "ethers";
import QRCode from "qrcode.react";
import "../styles/receive.css";
import { supabase } from "../supabaseClient";

const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";

export default function Receive() {
  const [walletAddress, setWalletAddress] = useState("");
  const [bnbBalance, setBnbBalance] = useState("0");

  useEffect(() => {
    async function fetchAddress() {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      try {
        const address = await signer.getAddress();
        setWalletAddress(address);

        const balance = await provider.getBalance(address);
        setBnbBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Failed to fetch wallet details", error);
      }
    }

    fetchAddress();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Wallet address copied to clipboard!");
  };

  return (
    <div className="receive-container">
      <h1>Receive BNB & Tokens</h1>
      <p>Your Wallet Address:</p>
      <div className="wallet-box">
        <span>{walletAddress}</span>
        <button onClick={copyToClipboard}>📋 Copy</button>
      </div>

      <h2>Your BNB Balance: {bnbBalance} BNB</h2>

      <div className="qr-code">
        <QRCode value={walletAddress} size={200} />
      </div>

      <div className="bscscan-link">
        <a href={`https://bscscan.com/address/${walletAddress}`} target="_blank" rel="noopener noreferrer">
          View on BscScan 🔗
        </a>
      </div>
    </div>
  );
}
