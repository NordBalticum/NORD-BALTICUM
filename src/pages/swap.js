import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { BrowserProvider, parseEther, formatEther } from "ethers";
import axios from "axios";
import { supabase } from "@/utils/supabaseClient";
import "@/styles/swap.module.css";

const ONEINCH_API = "https://api.1inch.io/v5.0/56/";
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;

export default function Swap() {
  const [fromToken, setFromToken] = useState("BNB");
  const [toToken, setToToken] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchQuote() {
      if (typeof window === "undefined" || !window.ethereum || !amount || Number(amount) <= 0) return;

      try {
        const res = await axios.get(`${ONEINCH_API}quote`, {
          params: {
            fromTokenSymbol: fromToken,
            toTokenSymbol: toToken,
            amount: parseEther(amount).toString(),
          },
        });

        setQuote(res.data);
      } catch (error) {
        console.error("Failed to fetch quote", error);
      }
    }

    fetchQuote();
  }, [amount, fromToken, toToken]);

  async function handleSwap() {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    if (!ADMIN_WALLET) {
      alert("Admin wallet address is not set. Please check your environment variables.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid swap amount.");
      return;
    }

    setLoading(true);
    
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // APSKAIČIUOJAME ADMIN MOKESTĮ 0.2%
      const totalAmount = parseEther(amount);
      const feeAmount = totalAmount * BigInt(2) / BigInt(1000); // 0.2% fee
      const swapAmount = totalAmount - feeAmount;

      // Siunčiame administracinį mokestį
      const feeTx = await signer.sendTransaction({
        to: ADMIN_WALLET,
        value: feeAmount,
      });

      setTxHash(feeTx.hash);

      // SWAP VYKDYMAS PER 1INCH API
      const swapTx = await axios.get(`${ONEINCH_API}swap`, {
        params: {
          fromTokenSymbol: fromToken,
          toTokenSymbol: toToken,
          amount: formatEther(swapAmount),
          fromAddress: address,
        },
      });

      console.log("Swap Successful!", swapTx.data);
      alert("Swap successful!");

    } catch (error) {
      console.error("Swap failed", error);
      alert("Swap failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.swapContainer}>
      <h1>Swap Crypto</h1>
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} min="0.01"/>
      <button onClick={handleSwap} disabled={loading}>{loading ? "Swapping..." : "Swap Now"}</button>

      {txHash && (
        <p>Transaction: <a href={`https://bscscan.com/tx/${txHash}`} target="_blank">View on BscScan</a></p>
      )}
    </div>
  );
}
