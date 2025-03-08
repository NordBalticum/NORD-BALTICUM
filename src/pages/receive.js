import { useState, useEffect } from "react";
import { ethers } from "ethers";
import QRCode from "react-qr-code";
import { supabase } from "@/loginsystem/supabaseClient";
import "@/styles/receive.css";

export default function Receive() {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function loadWallet() {
      if (!window.ethereum) return;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(balance));

        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("recipient", accounts[0])
          .order("created_at", { ascending: false });

        if (!error) setTransactions(data);
      }
    }
    loadWallet();
  }, []);

  return (
    <div className="receive-container">
      <h1>Receive Crypto</h1>

      <p>Your Wallet Address:</p>
      <input type="text" value={walletAddress} readOnly />

      {walletAddress && <QRCode value={walletAddress} size={120} />}

      <p>Current Balance: <strong>{balance} BNB</strong></p>

      <h2>Transaction History</h2>
      <ul>
        {transactions.map((tx, index) => (
          <li key={index}>
            <a href={`https://bscscan.com/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
              {tx.hash.substring(0, 6)}...{tx.hash.slice(-4)}
            </a> - {tx.amount} BNB
          </li>
        ))}
      </ul>
    </div>
  );
}
