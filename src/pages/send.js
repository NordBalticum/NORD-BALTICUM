import { useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { supabase } from "@/loginsystem/supabaseClient";
import QRCode from "react-qr-code";
import "@/styles/send.css";

export default function Send() {
  const router = useRouter();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);
  const [error, setError] = useState(null);

  const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET;
  const feePercentage = 0.02; // 2% fee

  async function handleSend() {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      const fee = ethers.utils.parseEther((amount * feePercentage).toString());
      const netAmount = ethers.utils.parseEther((amount - amount * feePercentage).toString());

      const txRecipient = await signer.sendTransaction({
        to: recipient,
        value: netAmount,
      });

      const txFee = await signer.sendTransaction({
        to: adminWallet,
        value: fee,
      });

      setTransactionHash(txRecipient.hash);
      await supabase.from("transactions").insert([
        { sender: address, recipient, amount, hash: txRecipient.hash },
      ]);

      setRecipient("");
      setAmount("");
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="send-container">
      <h1>Send Crypto</h1>

      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount (BNB)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handleSend}>Send</button>

      {transactionHash && (
        <p>
          Transaction Successful!{" "}
          <a href={`https://bscscan.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
            View on BSCScan
          </a>
        </p>
      )}

      {error && <p className="error">{error}</p>}

      {recipient && <QRCode value={recipient} size={120} />}
    </div>
  );
}
