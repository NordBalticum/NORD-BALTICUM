import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { ethers } from "ethers";
import { createReownClient } from "@reown/appkit";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => authListener?.unsubscribe();
  }, []);

  // Prisijungimas su el. paštu (Magic Link)
  async function signInWithEmail(email) {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  }

  // Atsijungimas
  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setWallet(null);
  }

  // Prisijungimas su Web3 (Reown / MetaMask)
  async function signInWithWallet() {
    if (!window.ethereum) {
      alert("MetaMask is required!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    setWallet(address);
  }

  return (
    <AuthContext.Provider value={{ user, wallet, signInWithEmail, signInWithWallet, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
