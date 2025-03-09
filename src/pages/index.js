import { useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/index.module.css";

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Jei vartotojas jau prisijungęs, peradresuojam į dashboard
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) router.push("/dashboard");
  }, []);

  return (
    <div className={styles["login-container"]}>
      <h1 className={styles["title"]}>Welcome to Nord Balticum</h1>

      <div className={styles["button-container"]}>
        <button className={styles["login-button"]} onClick={() => router.push("/login/loginwagmi")}>
          <img src="/public/walletconnect.png" alt="WalletConnect" className={styles["icon"]} />
          WalletConnect
        </button>

        <button className={styles["login-button"]} onClick={() => router.push("/login/loginweb3")}>
          <img src="/public/metamask.png" alt="MetaMask" className={styles["icon"]} />
          MetaMask
        </button>

        <button className={styles["login-button"]} onClick={() => router.push("/login/loginemail")}>
          <img src="/public/email.png" alt="Email Login" className={styles["icon"]} />
          Connect with Email
        </button>
      </div>
    </div>
  );
}
