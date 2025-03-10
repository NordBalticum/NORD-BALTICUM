import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { connectWallet } from "@/utils/wallet";
import { useRouter } from "next/router";
import styles from "@/styles/loginweb3.module.css";

export default function LoginWeb3() {
  const { user, loginWithMetaMask, walletAddress, loading } = useAuth();
  const [status, setStatus] = useState("idle"); // idle, connecting, success, error
  const router = useRouter();

  useEffect(() => {
    if (user && walletAddress) {
      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  }, [user, walletAddress, router]);

  const handleWalletLogin = async () => {
    setStatus("connecting");

    try {
      const wallet = await connectWallet();
      if (!wallet) throw new Error("⚠️ Failed to connect wallet.");

      await loginWithMetaMask(); // Autentifikuojam per MetaMask/Wagmi
      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error) {
      console.error("Wallet login error:", error);
      setStatus("error");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Connect Your Web3 Wallet</h1>

      {status === "error" && <p className={styles.error}>⚠️ Connection Failed. Try again.</p>}

      <button className={styles.loginButton} onClick={handleWalletLogin} disabled={status === "connecting"}>
        {status === "connecting" ? "Connecting..." : "Login with MetaMask"}
      </button>

      {status === "success" && <p className={styles.success}>✅ Connected! Redirecting...</p>}
    </div>
  );
      }
