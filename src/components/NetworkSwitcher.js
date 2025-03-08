import React, { useState, useEffect } from "react";
import "../styles/networkswitcher.css";

const NetworkSwitcher = () => {
  const [network, setNetwork] = useState("mainnet");

  useEffect(() => {
    const savedNetwork = localStorage.getItem("bscNetwork") || "mainnet";
    setNetwork(savedNetwork);
  }, []);

  const switchNetwork = (selectedNetwork) => {
    setNetwork(selectedNetwork);
    localStorage.setItem("bscNetwork", selectedNetwork);
    window.location.reload(); // Perkrauna sistemą su nauju tinklu
  };

  return (
    <div className="network-switcher">
      <p>Current Network: {network.toUpperCase()}</p>
      <button 
        onClick={() => switchNetwork("mainnet")}
        className={network === "mainnet" ? "active" : ""}
      >
        BSC Mainnet
      </button>
      <button 
        onClick={() => switchNetwork("testnet")}
        className={network === "testnet" ? "active" : ""}
      >
        BSC Testnet
      </button>
    </div>
  );
};

export default NetworkSwitcher;
