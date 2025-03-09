// src/login/loginweb3.js
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function LoginWeb3() {
  const router = useRouter();
  const { user, loginWithWallet, loading } = useAuth();

  useEffect(() => {
    if (user) router.push("/dashboard"); // Jei jau prisijungęs, meta tiesiai į dashboard
  }, [user]);

  return (
    <div className="login-container">
      <h1>Login with Web3</h1>
      <button onClick={loginWithWallet} disabled={loading}>Connect MetaMask</button>
    </div>
  );
}
