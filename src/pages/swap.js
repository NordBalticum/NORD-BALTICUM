import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { supabase } from "../supabaseClient";
import "../styles/swap.css";

const ONE_INCH_API = "https://api.1inch.io/v4.0/56";
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;

export default function Swap() {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState("BNB");
  const [toToken, setToToken] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [swapQuote, setSwapQuote] = useState(null);

  useEffect(() => {
    async function fetchTokens() {
      try {
        const res = await axios.get(`${ONE_INCH_API}/tokens`);
        setTokens(Object.values(res.data.tokens));
      } catch (error) {
        console.error("Failed to fetch tokens", error);
      }
    }
    fetchTokens();
  }, []);

  const getSwapQuote = async () => {
    if (!fromToken || !toToken || !amount) return;

    try {
      const res = await axios.get(`${ONE_INCH_API}/quote`, {
        params: {
          fromTokenAddress: fromToken,
          toTokenAddress: toToken,
          amount: ethers.utils.parseUnits(amount, 18).toString(),
        },
      });
      setSwapQuote(res.data);
    } catch (error) {
      console.error("Failed to fetch swap quote", error);
    }
  };

  const executeSwap = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    const feeAmount = (amount * 0.2) / 100;
    const swapAmount = amount - feeAmount;

    try {
      const tx = await signer.sendTransaction({
        to: ADMIN_WALLET,
        value: ethers.utils.parseEther(feeAmount.toString()),
      });
      await tx.wait();

      const swapTx = await axios.get(`${ONE_INCH_API}/swap`, {
        params: {
          fromTokenAddress: fromToken,
          toTokenAddress: toToken,
          amount: ethers.utils.parseUnits(swapAmount.toString(), 18).toString(),
          fromAddress: address,
          slippage: 1,
        },
      });

      await supabase.from("swaps").insert([{ user: address, fromToken, toToken, amount: swapAmount }]);

      alert("Swap Successful!");
    } catch (error) {
      console.error("Swap failed", error);
    }

    setLoading(false);
  };

  return (
    <div className="swap-container">
      <h1>Swap Your Tokens</h1>

      <div className="input-group">
        <label>From</label>
        <select value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
          <option value="BNB">BNB</option>
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>To</label>
        <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
          <option value="">Select Token</option>
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>

      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />

      <button onClick={getSwapQuote}>Get Quote</button>

      {swapQuote && (
        <div className="quote-box">
          <p>Estimated Output: {swapQuote.toTokenAmount / 10 ** swapQuote.toToken.decimals} {swapQuote.toToken.symbol}</p>
        </div>
      )}

      <button onClick={executeSwap} disabled={loading}>
        {loading ? "Processing..." : "Swap"}
      </button>
    </div>
  );
}
