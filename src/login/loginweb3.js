import { useEffect } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/loginweb3.module.css";

export default function LoginWeb3() {
  const { user, loginWithWallet } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user]);

  return (
    <div className="login-container">
      <h1>Login with MetaMask</h1>
      <button onClick={loginWithWallet}>Connect Wallet</button>
    </div>
  );
}
