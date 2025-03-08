import { useState, useEffect } from "react";
import { ethers } from "ethers";
import QRCode from "qrcode.react";
import { useRouter } from "next/router";
import { Button } from "@/components/Button";
import { supabase } from "@/utils/supabaseClient";
import "@/styles/send.css";

const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;

export default function Send() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [fee, setFee] = useState(3); // 3% fee
  const [connected, setConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    async function checkConnection() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) setConnected(true);
    }

    checkConnection();
  }, []);

  async function sendTransaction() {
    if (!recipient || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    if (!ethers.utils.isAddress(recipient)) {
      alert("Invalid recipient address.");
      return;
    }

    try {
      setSending(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const totalAmount = ethers.utils.parseEther(amount);
      const adminFee = totalAmount.mul(fee).div(100);
      const finalAmount = totalAmount.sub(adminFee);

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
      router.push("/dashboard");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="send-container">
      <h1>Send BNB / Tokens</h1>

      <div className="input-group">
        <label>Recipient Address</label>
        <input
          type="text"
          placeholder="Enter recipient wallet address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>

      <div className="input-group">
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

      <div className="qr-code">
        {recipient ? <QRCode value={recipient} size={200} /> : <p>No QR Code Available</p>}
      </div>

      {/* Dashboard buttons */}
      <div className="dashboard-buttons">
        <Button text="Send" onClick={() => router.push("/send")} />
        <Button text="Receive" onClick={() => router.push("/receive")} />
        <Button text="Stake" onClick={() => router.push("/stake")} />
        <Button text="Swap" onClick={() => router.push("/swap")} />
        <Button text="Donate" onClick={() => router.push("/donate")} />
      </div>
    </div>
  );
                                   }
