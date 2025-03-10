import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/utils/supabaseClient";
import { connectWallet } from "@/utils/wallet";
import { useRouter } from "next/router";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import { QueryClient } from "@tanstack/react-query";

// ✅ Sukuriamas `AuthContext`
const AuthContext = createContext(null);

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
      if (session?.user) {
        loadUserData(session.user);
      }
    });
  }, []);

  useEffect(() => {
    // ✅ Automatinis redirect į dashboard, jei prisijungęs
    if (user || walletAddress) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }, [user, walletAddress, router]);

  const loginWithMetaMask = async () => {
    try {
      const wallet = await connectWallet();
      if (!wallet) throw new Error("Wallet connection failed");

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
      console.error("Wallet login error:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

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

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setWalletAddress(null);
      localStorage.removeItem("user");
      localStorage.removeItem("walletAddress");
      router.push("/"); // ✅ Atsijungus nukreipia į pagrindinį puslapį
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        walletAddress,
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
