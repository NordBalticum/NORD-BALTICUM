import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import styles from @/styles/loginemail.module.css";

export default function LoginEmail() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user]);

  const sendMagicLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) return alert("Error sending Magic Link");
    setStep("otp");
  };

  const verifyOtp = async () => {
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "magiclink" });
    if (error) return alert("Invalid OTP");
    router.push("/dashboard");
  };

  return (
    <div className="login-container">
      <h1>Login with Email</h1>
      {step === "email" ? (
        <>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          <button onClick={sendMagicLink}>Send Magic Link</button>
        </>
      ) : (
        <>
          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
          <button onClick={verifyOtp}>Verify & Login</button>
        </>
      )}
    </div>
  );
}
