import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { QRCodeCanvas } from "qrcode.react";
import { useRouter } from "next/router";
import { Buttons } from "@/components/Buttons";
import { supabase } from "@/utils/supabaseClient";
import styles from "@/styles/send.module.css";

const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;

export default function Send() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [fee, setFee] = useState(3); // 3% fee
  const [connected, setConnected] = useState(false);
  const router = useRouter();

  // ✅ Optimizuotas async funkcija adresų tikrinimui
  const checkConnection = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) setConnected(true);
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  async function sendTransaction() {
    if (!recipient || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    if (!ethers.isAddress(recipient)) {
      alert("Invalid recipient address.");
      return;
    }

    try {
      setSending(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const totalAmount = ethers.parseEther(amount);
      const adminFee = (totalAmount * BigInt(fee)) / BigInt(100);
      const finalAmount = totalAmount - adminFee;

      // Pagrindinė transakcija
      const tx1 = await signer.sendTransaction({
        to: recipient,
        value: finalAmount,
      });

      // Administratoriaus mokestis
      const tx2 = await signer.sendTransaction({
        to: ADMIN_WALLET,
        value: adminFee,
      });

      alert(`Transaction successful! View on BscScan: https://bscscan.com/tx/${tx1.hash}`);
      
      // ✅ Išvalome laukus po transakcijos
      setRecipient("");
      setAmount("");
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={styles.sendContainer}>
      <h1>Send BNB / Tokens</h1>

      <div className={styles.inputGroup}>
        <label>Recipient Address</label>
        <input
          type="text"
          placeholder="Enter recipient wallet address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Amount (BNB)</label>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.0001"
        />
      </div>

      <button 
        onClick={sendTransaction} 
        disabled={!connected || sending || !recipient || !amount}
      >
        {sending ? "Sending..." : "Send"}
      </button>

      <div className={styles.qrCode}>
        {recipient ? <QRCodeCanvas value={recipient} size={200} /> : <p>No QR Code Available</p>}
      </div>

      {/* Dashboard buttons */}
      <div className={styles.dashboardButtons}>
        <Buttons text="Send" onClick={() => router.push("/send")} />
        <Buttons text="Receive" onClick={() => router.push("/receive")} />
        <Buttons text="Stake" onClick={() => router.push("/stake")} />
        <Buttons text="Swap" onClick={() => router.push("/swap")} />
        <Buttons text="Donate" onClick={() => router.push("/donate")} />
      </div>
    </div>
  );
                                         }
