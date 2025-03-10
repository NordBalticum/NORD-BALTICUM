import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/index.module.css";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  // ✅ Jei vartotojas jau prisijungęs – automatiškai nukreipiame į dashboard
  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  return (
    <div className={styles.container}>
      {/* ✅ DIDELIS, PREMIUM LOGOTIPAS */}
      <img src="/logo.png" alt="Nord Balticum Logo" className={styles.bigLogo} />

      {/* ✅ LOGIN MYGTUKAI - DABAR HORIZONTALIAI LYGIAGREČIAI, DIDESNI IR PREMIUM */}
      <div className={styles.buttonContainer}>
        <button className={styles.walletconnect} onClick={() => router.push("/login/loginwagmi")}>
          <img src="/walletconnect_new.png" alt="WalletConnect" className={styles.buttonIcon} />
        </button>

        <button className={styles.metamask} onClick={() => router.push("/login/loginweb3")}>
          <img src="/metamask_new.png" alt="MetaMask" className={styles.buttonIcon} />
        </button>

        <button className={styles.email} onClick={() => router.push("/login/loginemail")}>
          <img src="/email_new.png" alt="Email Login" className={styles.buttonIcon} />
        </button>
      </div>

      {/* ✅ PREMIUM FUNKCIJOS - SUDĖTA LYGIAGREČIAI, PERDARYTA NAUJAI, MINIMALISTIŠKIAU IR PRABANGIAU */}
      <div className={styles.features}>
        <div className={styles.featureCard}>
          <h2>🛡️ SECURE</h2>
          <p>Bank-grade encryption for all transactions.</p>
        </div>
        <div className={styles.featureCard}>
          <h2>⚡ FAST</h2>
          <p>Instant transactions on Binance Smart Chain.</p>
        </div>
      </div>
    </div>
  );
}
