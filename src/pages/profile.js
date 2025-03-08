import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loginHistory, setLoginHistory] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setUsername(data.username || "Anonymous");
          setWalletAddress(data.wallet_address || "No wallet linked");
          setLoginHistory(data.login_history || []);
        }

        if (error) console.error("Error fetching profile:", error);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }

    fetchProfile();
  }, [user]);

  function copyToClipboard() {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    alert("Wallet address copied!");
  }

  async function updateProfile() {
    if (!user) {
      alert("You must be logged in to update your profile.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user.id);

    if (error) alert("Failed to update profile.");
    else alert("Profile updated successfully!");
  }

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }

  return (
    <div className="profile-container">
      <h1>User Profile</h1>

      <label>Username:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
      />
      <button onClick={updateProfile}>Save</button>

      <h2>Wallet Address</h2>
      <p>{walletAddress}</p>
      <button onClick={copyToClipboard}>Copy</button>

      <h2>Login Method</h2>
      <p>{user?.provider === "google" ? "Google Login" : "MetaMask"}</p>

      <h2>Recent Logins</h2>
      {loginHistory.length > 0 ? (
        <ul>
          {loginHistory.map((login, index) => (
            <li key={index}>
              {new Date(login.timestamp).toLocaleString()} - {login.ip || "Unknown IP"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No login history available.</p>
      )}

      <h2>Settings</h2>
      <button onClick={toggleTheme}>Toggle Theme</button>

      <h2>Security</h2>
      <p>2FA Status: <span className="status">Disabled</span></p>
      <button>Enable 2FA (Coming Soon)</button>

      <button className="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
}
