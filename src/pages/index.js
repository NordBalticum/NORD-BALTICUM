import { useRouter } from "next/router";
import { useEffect } from "react";
import "../styles/index.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="onboarding-container">
      <h1>Welcome to <span className="highlight">Nord Balticum</span></h1>
      <p>The most advanced Web3 financial ecosystem.</p>

      <div className="cta-buttons">
        <button className="cta-button primary" onClick={() => router.push("/auth/login")}>
          🚀 Login with Wallet
        </button>
        <button className="cta-button secondary" onClick={() => router.push("/auth/signup")}>
          ✉️ Sign up with Email
        </button>
      </div>

      <div className="features">
        <div className="feature">
          <h3>🛡️ Secure</h3>
          <p>Bank-grade encryption for all transactions.</p>
        </div>
        <div className="feature">
          <h3>⚡ Fast</h3>
          <p>Instant transactions on Binance Smart Chain.</p>
        </div>
        <div className="feature">
          <h3>🌍 Global</h3>
          <p>Seamless payments worldwide.</p>
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 Nord Balticum. The Future of Web3 Finance.</p>
      </footer>
    </div>
  );
}
