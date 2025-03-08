import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import "../styles/swap.css";

const ONEINCH_API = "https://api.1inch.io/v5.0/56/";
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;

export default function Swap() {
  const [fromToken, setFromToken] = useState("BNB");
  const [toToken, setToToken] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchQuote() {
      if (!amount || parseFloat(amount) <= 0) return;
      try {
        const res = await axios.get(`${ONEINCH_API}quote`, {
          params: { fromTokenSymbol: fromToken, toTokenSymbol: toToken, amount: ethers.utils.parseEther(amount) },
        });
        setQuote(res.data);
      } catch (error) {
        console.error("Failed to fetch quote", error);
      }
    }
    fetchQuote();
  }, [amount, fromToken, toToken]);

  async function handleSwap() {
    if (!amount || parseFloat(amount) <= 0) return alert("Enter a valid amount");

    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // APSKAIČIUOJAME ADMIN MOKESTĮ 0.2%
      const feeAmount = (parseFloat(amount) * 0.2) / 100;
      const swapAmount = parseFloat(amount) - feeAmount;

      // PERVEDIMAS ADMIN UI MOKESČIUI
      const tx = await signer.sendTransaction({
        to: ADMIN_WALLET,
        value: ethers.utils.parseEther(feeAmount.toString()),
      });

      setTxHash(tx.hash);

      // SWAP VYKDYMAS PER 1INCH API
      const swapTx = await axios.get(`${ONEINCH_API}swap`, {
        params: { fromTokenSymbol: fromToken, toTokenSymbol: toToken, amount: swapAmount, fromAddress: address },
      });

      console.log("Swap Successful!", swapTx.data);
    } catch (error) {
      console.error("Swap failed", error);
    }
    setLoading(false);
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
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleSwap} disabled={loading}>{loading ? "Swapping..." : "Swap Now"}</button>
      {quote && <p>Expected Output: {quote.toTokenAmount} {toToken}</p>}
      {txHash && <p>Transaction: <a href={`https://bscscan.com/tx/${txHash}`} target="_blank">View on BscScan</a></p>}
    </div>
  );
      }
