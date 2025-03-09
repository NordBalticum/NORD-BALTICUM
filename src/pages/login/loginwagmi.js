import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { createAppKit } from "@reown/appkit/react";
import styles from "@/styles/loginwagmi.module.css";

export default function LoginWagmi() {
  const { user } = useAuth();
  const router = useRouter();
  const appKit = createAppKit();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user]);

  const connectWallet = async () => {
    try {
      const account = await appKit.connect();
      if (!account) throw new Error("Wallet connection failed");
      router.push("/dashboard");
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Failed to connect wallet.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login with WalletConnect</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
    </div>
  );
}
