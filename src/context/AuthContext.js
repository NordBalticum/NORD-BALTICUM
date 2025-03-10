import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import { QueryClient } from "@tanstack/react-query";
import { detectMobile } from "@/utils/helpers"; // ✅ FIXED IMPORT

// ✅ AppKit + Wagmi Adapter konfigūracija
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const queryClient = new QueryClient();
const wagmiAdapter = new WagmiAdapter({ projectId, networks: [mainnet, arbitrum] });
const appKit = createAppKit({ adapters: [wagmiAdapter], networks: [mainnet, arbitrum], projectId });

// ✅ Sukuriam AuthContext
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMobile(detectMobile()); // ✅ Nustatome, ar vartotojas mobilus
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await loadUserData(user);
      } else {
        logout();
      }
    } catch (error) {
      setError("❌ Session error");
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
      if (!wallet) return;

      setWalletAddress(wallet);
      fetchBalance(wallet);
    } catch (error) {
      setError("❌ Error loading user data");
    }
  };

  const fetchBalance = async (wallet) => {
    try {
      const balance = await getBalance(wallet);
      if (balance) setBalance(balance);
    } catch (error) {
      setError("❌ Balance fetch error");
    }
  };

  const loginWithWallet = async () => {
    try {
      setError(null);
      const account = await appKit.connect({ qrModal: isMobile });
      if (!account) throw new Error("❌ Wallet connection failed");

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
      setError("❌ Wallet login failed. Try again.");
    }
  };

  const loginWithMetaMask = async () => {
    try {
      setError(null);
      if (isMobile) {
        alert("⚠️ Use WalletConnect on mobile for better experience.");
        return;
      }

      const wallet = await connectWallet();
      if (!wallet) throw new Error("❌ MetaMask login failed.");

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
      setError("❌ MetaMask login failed.");
    }
  };

  const loginWithEmail = async (email) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("✅ Check your email for the Magic Link.");
    } catch (error) {
      setError("❌ Failed to send Magic Link.");
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
      setError("❌ Logout error");
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
        isMobile, // ✅ PRIDĖTAS MOBILIŲ APTIKIMAS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
