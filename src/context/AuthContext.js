import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/utils/supabaseClient";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import { QueryClient } from "@tanstack/react-query";

// ✅ Sukuriamas `AuthContext`
const AuthContext = createContext(null);

// ✅ AppKit + Wagmi Adapter konfigūracija
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const queryClient = new QueryClient();

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [mainnet, arbitrum],
});

const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, arbitrum],
  projectId,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          await loadUserData(user);
        }
      } catch (error) {
        console.error("Session check error:", error);
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
    try {
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
      await fetchBalance(wallet);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("walletAddress", wallet);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  // ✅ Automatinis BSC balanso gavimas su `ethers.js`
  const fetchBalance = async (wallet) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
      const balance = await provider.getBalance(wallet);
      setBalances(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Balance fetch error:", error);
    }
  };

  // ✅ Naujo Ethereum Wallet generavimas, jei jo nėra
  const generateNewWallet = () => {
    const wallet = ethers.Wallet.createRandom();
    return wallet.address;
  };

  // ✅ Wallet prisijungimas per Wagmi/WalletConnect
  const loginWithWallet = async () => {
    try {
      const account = await appKit.connect();
      if (!account) throw new Error("Wallet connection failed");

      setWalletAddress(account.address);
      localStorage.setItem("walletAddress", account.address);

      let { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", account.address)
        .single();

      if (!user) {
        await supabase.from("users").insert({ wallet_address: account.address });
      }

      await loadUserData(user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Wallet login error:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  // ✅ Prisijungimas per MetaMask (su `ethers.js`)
  const loginWithMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const wallet = await signer.getAddress();

        setWalletAddress(wallet);
        localStorage.setItem("walletAddress", wallet);

        let { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("wallet_address", wallet)
          .single();

        if (!user) {
          await supabase.from("users").insert({ wallet_address: wallet });
        }

        await loadUserData(user);
        router.push("/dashboard");
      } catch (error) {
        console.error("MetaMask login error:", error);
      }
    } else {
      alert("MetaMask not installed!");
    }
  };

  // ✅ Prisijungimas per Supabase Magic Link
  const loginWithEmail = async (email) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for the Magic Link.");
    } catch (error) {
      console.error("Magic Link login error:", error);
      alert("Failed to send Magic Link.");
    }
  };

  // ✅ Visiškas Logout iš visų metodų
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setWalletAddress(null);
      setBalances([]);
      localStorage.removeItem("user");
      localStorage.removeItem("walletAddress");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        walletAddress,
        balances,
        loginWithWallet,
        loginWithMetaMask,
        loginWithEmail,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
