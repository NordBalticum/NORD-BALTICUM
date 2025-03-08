import React, { useState, useEffect } from "react";
import "../styles/networkswitcher.css";

const NetworkSwitcher = () => {
  const [network, setNetwork] = useState("Mainnet");

  useEffect(() => {
    const savedNetwork = localStorage.getItem("bscNetwork") || "Mainnet";
    setNetwork(savedNetwork);
  }, []);

  const switchNetwork = () => {
    const newNetwork = network === "Mainnet" ? "Testnet" : "Mainnet";
    setNetwork(newNetwork);
    localStorage.setItem("bscNetwork", newNetwork);
    alert(`Switched to ${newNetwork}`);
    window.location.reload(); // Perkrauna puslapį su nauju tinklu
  };

  return (
    <div className="network-switcher">
      <p>Current Network: <strong>{network}</strong></p>
      <button 
        onClick={switchNetwork} 
        className={network === "Mainnet" ? "active" : ""}
      >
        Switch to {network === "Mainnet" ? "Testnet" : "Mainnet"}
      </button>
    </div>
  );
};

export default NetworkSwitcher;
