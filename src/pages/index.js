import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/loginsystem/supabaseClient";
import "@/styles/index.css";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        router.replace("/dashboard");
      }
      setLoading(false);
    }
    checkUser();
  }, [router]);

  if (loading) return null;

  return (
    <div className="onboarding-wrapper">
      <motion.main
        className="onboarding-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image src="/icons/nb-logo.svg" alt="Nord Balticum Logo" width={120} height={120} priority />
        <div className="button-group">
          <motion.button
            className="login-btn"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/login")}
          >
            Login with Email
          </motion.button>
          <motion.button
            className="wallet-btn"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/wallet-login")}
          >
            Login with Wallet
          </motion.button>
        </div>
        <motion.p className="register-text">
          New here? <a className="register-link" onClick={() => router.push("/register")}>Create an Account</a>
        </motion.p>
      </motion.main>
    </div>
  );
}
