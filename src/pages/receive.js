import { useState, useEffect } from "react";
import { ethers } from "ethers";
import QRCode from "qrcode.react";
import axios from "axios";
import "../styles/receive.css";

const BSC_SCAN_API = process.env.NEXT_PUBLIC_BSC_SCAN_API;
const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";

export default function Receive() {
  const [walletAddress, setWalletAddress] = useState("");
  const [bnbBalance, setBnbBalance] = useState("0");
  const [tokens, setTokens] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchWalletData() {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      try {
        const address = await signer.getAddress();
        setWalletAddress(address);

        const balance = await provider.getBalance(address);
        setBnbBalance(ethers.utils.formatEther(balance));

        // Gauti visų tokenų balansą iš BscScan
        const tokenRes = await axios.get(
          `https://api.bscscan.com/api?module=account&action=tokenbalance&address=${address}&apikey=${BSC_SCAN_API}`
        );

        if (tokenRes.data.status === "1") {
          setTokens(tokenRes.data.result);
        }

        // Gauti paskutines transakcijas iš BscScan
        const txRes = await axios.get(
          `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${BSC_SCAN_API}`
        );

        if (txRes.data.status === "1") {
          setTransactions(txRes.data.result.slice(0, 5)); // Rodo paskutines 5 transakcijas
        }
      } catch (error) {
        console.error("Failed to fetch wallet data", error);
      }
    }

    fetchWalletData();
  }, []);

  function copyToClipboard() {
    navigator.clipboard.writeText(walletAddress);
    alert("Wallet address copied!");
  }

  return (
    <div className="receive-container">
      <h1>Receive Crypto</h1>
      <p>Your BNB Wallet:</p>
      <div className="wallet-box">
        <p>{walletAddress}</p>
        <button onClick={copyToClipboard}>Copy</button>
      </div>

      <h2>Scan QR Code</h2>
      <QRCode value={walletAddress} size={150} />

      <h2>BNB Balance</h2>
      <p>{bnbBalance} BNB</p>

      <h2>Your Tokens</h2>
      {tokens.length > 0 ? (
        tokens.map((token, index) => (
          <div key={index} className="token-item">
            <span>{token.tokenName}</span>
            <span>{ethers.utils.formatUnits(token.balance, token.tokenDecimal)} {token.tokenSymbol}</span>
          </div>
        ))
      ) : (
        <p>No tokens found</p>
      )}

      <h2>Recent Transactions</h2>
      {transactions.length > 0 ? (
        transactions.map((tx, index) => (
          <div key={index} className="tx-item">
            <a href={`https://bscscan.com/tx/${tx.hash}`} target="_blank">View on BscScan</a>
          </div>
        ))
      ) : (
        <p>No recent transactions</p>
      )}
    </div>
  );
}
