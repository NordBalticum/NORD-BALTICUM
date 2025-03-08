import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { connectWallet, getBalance } from "@/utils/wallet";
import { supabase } from "@/utils/supabaseClient";

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Tikriname prisijungimą per Supabase (Magic Link)
  useEffect(() => {
    let isMounted = true;

    async function fetchUserSession() {
      const { data: session, error } = await supabase.auth.getSession();
      if (error) console.error("Session fetch error:", error);
      if (isMounted) setUser(session?.user ?? null);
    }

    fetchUserSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // ✅ Tikriname ar prijungtas Web3 wallet'as
  useEffect(() => {
    let isMounted = true;

    async function fetchWallet() {
      try {
        const address = await connectWallet();
        if (address && isMounted) {
          setWallet(address);
          await saveWalletToDB(address);
          await updateBalance(address);
        }
      } catch (error) {
        console.error("Failed to fetch wallet:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchWallet();

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ Pridedame funkciją, kuri įrašo piniginės adresą į Supabase
  const saveWalletToDB = async (address) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const { error } = await supabase
        .from("users") // 🔹 Pakeisk į savo lentelės pavadinimą
        .update({ wallet: address })
        .eq("id", user.data.user.id);

      if (error) {
        console.error("❌ Error saving wallet:", error);
      } else {
        console.log("✅ Wallet saved successfully!");
      }
    } catch (error) {
      console.error("❌ Unexpected error in saveWalletToDB:", error);
    }
  };

  const updateBalance = useCallback(async (address) => {
    try {
      const bal = await getBalance(address);
      setBalance(bal);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  }, []);

  const reconnectWallet = async () => {
    try {
      const address = await connectWallet();
      if (address) {
        setWallet(address);
        await updateBalance(address);
      }
    } catch (error) {
      console.error("Failed to reconnect wallet:", error);
    }
  };

  // ✅ Atsijungimo funkcija (Supabase + Web3)
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setWallet(null);
      setBalance("0");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, balance, reconnectWallet, loading, user, signOut }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
