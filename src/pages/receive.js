import { useState, useEffect } from "react";
import { ethers } from "ethers";
import QRCode from "qrcode.react";
import { supabase } from "../utils/supabaseClient";
import "../styles/receive.css";

const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";

export default function Receive() {
  const [walletAddress, setWalletAddress] = useState("");
  const [bnbBalance, setBnbBalance] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAddress() {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        setLoading(false);
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
        alert("Error fetching wallet details. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchAddress();
  }, []);

  const copyToClipboard = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    alert("Wallet address copied to clipboard!");
  };

  return (
    <div className="receive-container">
      <h1>Receive BNB & Tokens</h1>

      {loading ? (
        <p>Loading wallet details...</p>
      ) : (
        <>
          <p>Your Wallet Address:</p>
          <div className="wallet-box">
            <span>{walletAddress || "No address found"}</span>
            <button onClick={copyToClipboard}>📋 Copy</button>
          </div>

          <h2>Your BNB Balance: {bnbBalance} BNB</h2>

          <div className="qr-code">
            {walletAddress ? <QRCode value={walletAddress} size={200} /> : <p>No QR Code Available</p>}
          </div>

          {walletAddress && (
            <div className="bscscan-link">
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
