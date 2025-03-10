import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import { QueryClient } from "@tanstack/react-query";
import { detectMobile, isValidEmail } from "@/utils/helpers";

// ✅ AppKit + Wagmi Adapter konfigūracija
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const queryClient = new QueryClient();
const wagmiAdapter = new WagmiAdapter({ projectId, networks: [mainnet, arbitrum] });
const appKit = createAppKit({ adapters: [wagmiAdapter], networks: [mainnet, arbitrum], projectId });

// ✅ Sukuriame `AuthContext`
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
        check2FAStatus(session.user);
        loadUserData(session.user);
      } else {
        logout();
      }
    });

    return () => listener?.unsubscribe();
  }, []);

  // ✅ Patikrina aktyvią sesiją
  const checkSession = async () => {
    setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (user) {
        setUser(user);
        check2FAStatus(user);
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

  // ✅ Tikrina, ar vartotojas aktyvavęs 2FA
  const check2FAStatus = async (user) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("requires_2fa")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      setRequires2FA(data?.requires_2fa || false);
    } catch (err) {
      setError("❌ 2FA check error: " + err.message);
    }
  };

  // ✅ Užkrauna vartotojo duomenis
  const loadUserData = async (user) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("wallet_address")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      if (data?.wallet_address) {
        setWalletAddress(data.wallet_address);
        fetchBalance(data.wallet_address);
      }
    } catch (err) {
      setError("❌ Error loading user data: " + err.message);
    }
  };

  // ✅ Balanso tikrinimas
  const fetchBalance = async (wallet) => {
    try {
      const balance = await getBalance(wallet);
      setBalance(balance || "0");
    } catch (err) {
      setError("❌ Balance fetch error: " + err.message);
    }
  };

  // ✅ Prisijungimas su WalletConnect
  const loginWithWallet = async () => {
    try {
      setError(null);
      setLoading(true);
      const account = await appKit.connect({ qrModal: isMobile });
      if (!account?.address) throw new Error("❌ Wallet connection failed");
      
      setWalletAddress(account.address);
      const { data: user, error } = await supabase
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
        await loadUserData(data);
      }

      router.push("/dashboard");
    } catch (err) {
      setError("❌ Wallet login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Prisijungimas su MetaMask
  const loginWithMetaMask = async () => {
    try {
      setError(null);
      setLoading(true);
      if (isMobile) return alert("⚠️ Use WalletConnect on mobile.");
      
      const wallet = await connectWallet();
      if (!wallet) throw new Error("❌ MetaMask login failed.");
      
      setWalletAddress(wallet);
      const { data: user, error } = await supabase
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
        await loadUserData(data);
      }

      router.push("/dashboard");
    } catch (err) {
      setError("❌ MetaMask login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Prisijungimas su el. paštu (Magic Link)
  const loginWithEmail = async (email) => {
    try {
      if (!isValidEmail(email)) return setError("❌ Invalid email format.");
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
        requires2FA,
        isMobile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
