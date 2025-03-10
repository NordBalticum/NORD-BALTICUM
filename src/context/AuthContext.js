import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import { QueryClient } from "@tanstack/react-query";
import { detectMobile } from "@/utils/helpers";

// ✅ ENV KINTAMIEJI
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const ENABLE_2FA = process.env.NEXT_PUBLIC_ENABLE_2FA === "true";
const IS_TESTNET = process.env.NEXT_PUBLIC_IS_TESTNET === "true";

// ✅ Konfigūracija pagal tinklą (Testnet arba Mainnet)
const queryClient = new QueryClient();
const wagmiAdapter = new WagmiAdapter({ projectId, networks: IS_TESTNET ? [arbitrum] : [mainnet] });
const appKit = createAppKit({ adapters: [wagmiAdapter], networks: IS_TESTNET ? [arbitrum] : [mainnet], projectId });

// ✅ Sukuriamas AuthContext
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMobile(detectMobile());
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadUserData(session.user);
      } else {
        logout();
      }
    });

    return () => listener?.unsubscribe();
  }, []);

  const checkSession = async () => {
    setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (user) {
        setUser(user);
        await loadUserData(user);
      } else {
        logout();
      }
    } catch (err) {
      setError("❌ Session error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (user) => {
    try {
      const { data: walletData, error } = await supabase
        .from("users")
        .select("wallet_address, requires_2fa")
        .eq("email", user.email)
        .single();

      if (error) throw error;
      if (!walletData?.wallet_address) return;

      setWalletAddress(walletData.wallet_address);
      setRequires2FA(ENABLE_2FA && walletData.requires_2fa);
      fetchBalance(walletData.wallet_address);
    } catch (err) {
      setError("❌ Error loading user data: " + err.message);
    }
  };

  const fetchBalance = async (wallet) => {
    try {
      const balance = await getBalance(wallet);
      setBalance(balance || "0");
    } catch (err) {
      setError("❌ Balance fetch error: " + err.message);
    }
  };

  // ✅ WalletConnect prisijungimas
  const loginWithWallet = async () => {
    try {
      setError(null);
      setLoading(true);
      const account = await appKit.connect({ qrModal: isMobile });

      if (!account?.address) throw new Error("❌ Wallet connection failed");

      setWalletAddress(account.address);
      let { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", account.address)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (!user) {
        const { data } = await supabase
          .from("users")
          .insert({ wallet_address: account.address })
          .select("*")
          .single();

        user = data;
      }

      if (requires2FA) {
        router.push("/2fa");
      } else {
        await loadUserData(user);
        router.push("/dashboard");
      }
    } catch (err) {
      setError("❌ Wallet login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ MetaMask prisijungimas
  const loginWithMetaMask = async () => {
    try {
      setError(null);
      setLoading(true);
      if (isMobile) {
        alert("⚠️ Use WalletConnect on mobile for better experience.");
        return;
      }

      const wallet = await connectWallet();
      if (!wallet) throw new Error("❌ MetaMask login failed.");

      setWalletAddress(wallet);
      let { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", wallet)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (!user) {
        const { data } = await supabase
          .from("users")
          .insert({ wallet_address: wallet })
          .select("*")
          .single();

        user = data;
      }

      if (requires2FA) {
        router.push("/2fa");
      } else {
        await loadUserData(user);
        router.push("/dashboard");
      }
    } catch (err) {
      setError("❌ MetaMask login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Magic Link prisijungimas
  const loginWithEmail = async (email) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("✅ Check your email for the Magic Link.");
    } catch (err) {
      setError("❌ Failed to send Magic Link: " + err.message);
    }
  };

  // ✅ Atsijungimas
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setWalletAddress(null);
      setBalance("0");
      router.push("/");
    } catch (err) {
      setError("❌ Logout error: " + err.message);
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
        error,
        isMobile,
        requires2FA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
