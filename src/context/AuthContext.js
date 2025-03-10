import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";
import { connectWallet, getBalance } from "@/utils/wallet";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import { QueryClient } from "@tanstack/react-query";

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
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadUserData(session.user);
      } else {
        logout(); // ✅ Jei nėra vartotojo – automatinis logout
      }
    });

    return () => listener?.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await loadUserData(user);
      } else {
        logout();
      }
    } catch (error) {
      console.error("❌ Session check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (user) => {
    try {
      const { data: walletData } = await supabase
        .from("users")
        .select("wallet_address")
        .eq("email", user.email)
        .single();

      let wallet = walletData?.wallet_address || null;

      if (!wallet) {
        console.warn("⚠️ No wallet found, skipping balance fetch.");
        return;
      }

      setWalletAddress(wallet);
      fetchBalance(wallet);
    } catch (error) {
      console.error("❌ Error loading user data:", error);
    }
  };

  const fetchBalance = async (wallet) => {
    try {
      const balance = await getBalance(wallet);
      if (balance) setBalance(balance);
    } catch (error) {
      console.error("❌ Balance fetch error:", error);
    }
  };

  const loginWithWallet = async () => {
    try {
      const account = await appKit.connect();
      if (!account) throw new Error("Wallet connection failed");

      setWalletAddress(account.address);

      let { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", account.address)
        .single();

      if (!user) {
        const { data } = await supabase.from("users").insert({ wallet_address: account.address }).select("*").single();
        user = data;
      }

      await loadUserData(user);
      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Wallet login error:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  const loginWithMetaMask = async () => {
    try {
      const wallet = await connectWallet();
      if (!wallet) throw new Error("MetaMask login failed.");

      setWalletAddress(wallet);

      let { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", wallet)
        .single();

      if (!user) {
        const { data } = await supabase.from("users").insert({ wallet_address: wallet }).select("*").single();
        user = data;
      }

      await loadUserData(user);
      router.push("/dashboard");
    } catch (error) {
      console.error("❌ MetaMask login error:", error);
    }
  };

  const loginWithEmail = async (email) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for the Magic Link.");
    } catch (error) {
      console.error("❌ Magic Link login error:", error);
      alert("Failed to send Magic Link.");
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setWalletAddress(null);
      setBalance("0");
      router.push("/");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        walletAddress,
        balance,
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
