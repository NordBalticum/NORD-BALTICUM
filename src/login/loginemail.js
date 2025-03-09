import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function LoginEmail() {
  const router = useRouter();
  const { user, loginWithEmail, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1); // 1 - įvesti email, 2 - įvesti kodą

  useEffect(() => {
    if (user) router.push("/dashboard"); // Jei jau prisijungęs, meta tiesiai į dashboard
  }, [user]);

  const handleEmailSubmit = () => {
    loginWithEmail(email);
    setStep(2); // Pereinam prie kodo suvedimo
  };

  return (
    <div className="login-container">
      <h1>Login with Email</h1>
      {step === 1 ? (
        <>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={handleEmailSubmit} disabled={loading}>Send Magic Link</button>
        </>
      ) : (
        <>
          <input type="text" placeholder="Enter the code" value={code} onChange={(e) => setCode(e.target.value)} />
          <button onClick={() => alert("Verifying...")} disabled={loading}>Verify</button>
        </>
      )}
    </div>
  );
}
