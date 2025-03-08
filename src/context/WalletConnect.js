import { createContext, useContext, useEffect, useState } from "react";
import { connectWallet, getBalance } from "../utils/wallet";

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    async function fetchWallet() {
      try {
        const address = await connectWallet();
        if (address) {
          setWallet(address);
          updateBalance(address);
        }
      } catch (error) {
        console.error("Failed to fetch wallet:", error);
      }
    }

    fetchWallet();
  }, []);

  const updateBalance = async (address) => {
    try {
      const bal = await getBalance(address);
      setBalance(bal);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const reconnectWallet = async () => {
    const address = await connectWallet();
    if (address) {
      setWallet(address);
      updateBalance(address);
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, balance, reconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
