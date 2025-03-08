import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { ethers } from "ethers";
import "../styles/Receive.css";

export default function Receive() {
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    async function getWallet() {
      if (!window.ethereum) return alert("Please install MetaMask.");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
    }
    getWallet();
  }, []);

  return (
    <div className="receive-container">
      <h1>Receive Funds</h1>
      <p>Your Wallet:</p>
      <input type="text" readOnly value={walletAddress} />
      <button onClick={() => navigator.clipboard.writeText(walletAddress)}>
        Copy Address
      </button>
      <QRCode value={walletAddress} />
    </div>
  );
}
