import { useState, useEffect } from "react";
import { ethers } from "ethers";
import QRCode from "qrcode.react";
import { useRouter } from "next/router";
import "../styles/Send.css";
import Button from "../components/Buttons";

const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;

export default function Send() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [fee, setFee] = useState(3); // 3% fee
  const router = useRouter();

  useEffect(() => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }
  }, []);

  async function sendTransaction() {
    if (!recipient || !amount) return alert("Fill all fields!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const totalAmount = ethers.utils.parseEther(amount);
    const adminFee = totalAmount.mul(fee).div(100);
    const finalAmount = totalAmount.sub(adminFee);

    try {
      setSending(true);

      // Main transaction
      const tx1 = await signer.sendTransaction({
        to: recipient,
        value: finalAmount,
      });

      // Admin Fee transaction (same time)
      const tx2 = await signer.sendTransaction({
        to: ADMIN_WALLET,
        value: adminFee,
      });

      alert(`Transaction sent! View on BscScan: https://bscscan.com/tx/${tx1.hash}`);
      router.push("/dashboard");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed! Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="send-container">
      <h1>Send BNB / Tokens</h1>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={sendTransaction} disabled={sending}>
        {sending ? "Sending..." : "Send"}
      </button>
      <QRCode value={recipient || "Scan QR"} />
    </div>
        
<div className="dashboard-buttons">
  <Button text="Send" onClick={() => router.push("/send")} />
  <Button text="Receive" onClick={() => router.push("/receive")} />
  <Button text="Stake" onClick={() => router.push("/stake")} />
  <Button text="Swap" onClick={() => router.push("/swap")} />
  <Button text="Donate" onClick={() => router.push("/donate")} />
</div>
  );
}
