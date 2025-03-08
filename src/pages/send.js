import { useState, useEffect } from "react";
import { ethers } from "ethers";
import QRCode from "qrcode.react";
import { useRouter } from "next/router";

const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET; // Admin fees auto-send

export default function Send() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState(0.001); // 0.1% fee
  const [sending, setSending] = useState(false);
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
      const tx = await signer.sendTransaction({
        to: recipient,
        value: finalAmount,
      });

      // Admin Fee transaction (same time)
      await signer.sendTransaction({
        to: ADMIN_WALLET,
        value: adminFee,
      });

      alert("Transaction sent! View on BscScan");
      router.push("/dashboard");
    } catch (error) {
      console.error("Transaction failed:", error);
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
  );
}
