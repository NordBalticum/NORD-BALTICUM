import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { signInWithMagicLink, assignWalletToUser } from "@/utils/auth";
import { useRouter } from "next/router";
import styles from "@/styles/loginemail.module.css";

export default function LoginEmail() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, sending, success, error
  const router = useRouter();

  const handleMagicLinkLogin = async (e) => {
    e.preventDefault();
    setStatus("sending");

    const result = await signInWithMagicLink(email);

    if (result.success) {
      setStatus("checking");

      // ✅ Patikrina, ar vartotojas jau turi wallet'ą
      const walletAssigned = await assignWalletToUser(email);

      if (walletAssigned.success) {
        setStatus("success");
        setTimeout(() => router.push("/dashboard"), 3000);
      } else {
        setStatus("error");
      }
    } else {
      setStatus("error");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign in with Magic Link</h1>

      {status === "checking" && <p className={styles.checking}>🔄 Checking wallet...</p>}
      {status === "error" && <p className={styles.error}>⚠️ Failed to sign in. Try again.</p>}
      {status === "success" && <p className={styles.success}>✅ Check your email for the link!</p>}

      <form onSubmit={handleMagicLinkLogin} className={styles.form}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.loginButton} disabled={status === "sending" || status === "checking"}>
          {status === "sending" ? "Sending..." : "Send Magic Link"}
        </button>
      </form>
    </div>
  );
      }
