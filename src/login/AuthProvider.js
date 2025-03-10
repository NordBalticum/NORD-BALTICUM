import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import { QueryClient } from "@tanstack/react-query";
import { detectMobile, isValidAddress } from "@/utils/helpers";

// ✅ AppKit konfigūracija
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const queryClient = new QueryClient();
const wagmiAdapter = new WagmiAdapter({ projectId, networks: [mainnet, arbitrum] });
const appKit = createAppKit({ adapters: [wagmiAdapter], networks: [mainnet, arbitrum], projectId });

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMobile(detectMobile());
  }, []);

  const loginWithWallet = async () => {
    try {
      setError(null);
      setLoading(true);
      const account = await appKit.connect({ qrModal: isMobile });

      if (!account?.address || !isValidAddress(account.address)) throw new Error("❌ Invalid Wallet Address");

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

      router.push("/dashboard");
    } catch (err) {
      setError("❌ Wallet login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithMetaMask = async () => {
    try {
      setError(null);
      setLoading(true);
      if (isMobile) {
        alert("⚠️ Use WalletConnect on mobile for better experience.");
        return;
      }

      const wallet = await connectWallet();
      if (!wallet || !isValidAddress(wallet)) throw new Error("❌ MetaMask login failed.");

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

      router.push("/dashboard");
    } catch (err) {
      setError("❌ MetaMask login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <AuthContext.Provider value={{ loginWithWallet, loginWithMetaMask, loginWithEmail, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
