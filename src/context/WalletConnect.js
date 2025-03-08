import { createContext, useContext, useEffect, useState } from "react";
import { connectWallet, getBalance } from "../utils/wallet";

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    async function fetchWallet() {
      const address = await connectWallet();
      if (address) {
        setWallet(address);
        const bal = await getBalance(address);
        setBalance(bal);
      }
    }

    fetchWallet();
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, balance }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
