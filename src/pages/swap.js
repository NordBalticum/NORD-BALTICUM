import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import axios from "axios";
import { Buttons } from "@/components/Buttons";
import { supabase } from "@/utils/supabaseClient";
import styles from "@/styles/swap.module.css";

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
      if (!window.ethereum) {
        console.error("MetaMask is required.");
        return;
      }

      if (!amount || parseFloat(amount) <= 0) return;

      try {
        const res = await axios.get(`${ONEINCH_API}quote`, {
          params: {
            fromTokenSymbol: fromToken,
            toTokenSymbol: toToken,
            amount: ethers.utils.parseEther(amount).toString(),
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
    if (!window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    if (!ADMIN_WALLET) {
      alert("Admin wallet address is not set. Please check your environment variables.");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert("Enter a valid swap amount.");
      return;
    }

    setLoading(true);
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // APSKAIČIUOJAME ADMIN MOKESTĮ 0.2%
      const totalAmount = ethers.utils.parseEther(amount);
      const feeAmount = totalAmount.mul(2).div(1000); // 0.2% fee
      const swapAmount = totalAmount.sub(feeAmount);

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
          amount: ethers.utils.formatEther(swapAmount),
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
    <div className="swap-container">
      <h1>Swap Crypto</h1>
      <p>Select Tokens & Amount</p>

      <select value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
        <option value="BNB">BNB</option>
        <option value="USDT">USDT</option>
        <option value="ETH">ETH</option>
      </select>

      <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
        <option value="BNB">BNB</option>
        <option value="USDT">USDT</option>
        <option value="ETH">ETH</option>
      </select>

      <input 
        type="number" 
        placeholder="Amount" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
        min="0.01"
        step="0.01"
      />

      <button onClick={handleSwap} disabled={loading}>
        {loading ? "Swapping..." : "Swap Now"}
      </button>

      {quote && (
        <p>
          Expected Output: {ethers.utils.formatEther(quote.toTokenAmount)} {toToken}
        </p>
      )}

      {txHash && (
        <p>
          Transaction:{" "}
          <a href={`https://bscscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
            View on BscScan
          </a>
        </p>
      )}

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
