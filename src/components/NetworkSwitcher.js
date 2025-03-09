import React, { useState, useEffect } from "react";
import "@/styles/networkswitcher.module.css";

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
    
    // Jei būtina, perkrauna puslapį, bet tik jei tinklas skiriasi nuo dabartinio
    if (network !== newNetwork) {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div className="network-switcher">
      <p>
        Current Network: <strong className={network === "Mainnet" ? "mainnet" : "testnet"}>
          {network}
        </strong>
      </p>
      <button onClick={switchNetwork} className={network === "Mainnet" ? "mainnet-btn" : "testnet-btn"}>
        Switch to {network === "Mainnet" ? "Testnet" : "Mainnet"}
      </button>
    </div>
  );
};

export default NetworkSwitcher;
