import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import styles from "@/styles/loginemail.module.css";

export default function LoginEmail() {
  const { loginWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, sending, success, error
  const router = useRouter();

  const handleMagicLinkLogin = async (e) => {
    e.preventDefault();
    if (!email) return alert("Enter a valid email!");

    setStatus("sending");
    const result = await loginWithEmail(email);

    if (result.success) {
      setStatus("checking");

      setTimeout(() => {
        setStatus("success");
        setTimeout(() => router.push("/dashboard"), 2000); // ✅ Automatinis peradresavimas
      }, 1500);
    } else {
      setStatus("error");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🔒 Secure Web3 Email Login</h1>

      {/* 🔹 Dinaminiai pranešimai */}
      {status === "checking" && <p className={styles.checking}>🔄 Verifying account...</p>}
      {status === "error" && <p className={styles.error}>⚠️ Failed to sign in. Try again.</p>}
      {status === "success" && <p className={styles.success}>✅ Magic Link sent! Check your email.</p>}

      {/* 🔹 Prisijungimo forma */}
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
