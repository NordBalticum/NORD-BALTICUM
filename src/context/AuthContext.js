import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../utils/supabaseClient";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await loadUserData(user);
      }
      setLoading(false);
    };

    checkSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadUserData(session.user);
    });
  }, []);

  const loadUserData = async (user) => {
    const { data: walletData } = await supabase
      .from("users")
      .select("wallet_address")
      .eq("email", user.email)
      .single();

    let wallet = walletData?.wallet_address;

    if (!wallet) {
      wallet = generateNewWallet();
      await supabase
        .from("users")
        .update({ wallet_address: wallet })
        .eq("email", user.email);
    }

    setWalletAddress(wallet);

    const { data: balanceData } = await supabase
      .from("balances")
      .select("*")
      .eq("user_id", user.id);

    setBalances(balanceData || []);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("walletAddress", wallet);
    localStorage.setItem("balances", JSON.stringify(balanceData || []));
  };

  const generateNewWallet = () => {
    const wallet = ethers.Wallet.createRandom();
    return wallet.address;
  };

  const loginWithWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);

      let { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", address)
        .single();

      if (!user) {
        const { data, error } = await supabase
          .from("users")
          .insert({ wallet_address: address });

        if (error) console.error(error);
      }

      await loadUserData(user);
      router.push("/dashboard");
    } else {
      alert("Please install MetaMask or use WalletConnect.");
    }
  };

  const loginWithEmail = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) console.error(error);
    else alert("Check your email for the Magic Link.");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setWalletAddress(null);
    setBalances([]);
    localStorage.removeItem("user");
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("balances");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, walletAddress, balances, loginWithWallet, loginWithEmail, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
