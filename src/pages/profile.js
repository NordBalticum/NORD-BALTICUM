import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { ethers } from "ethers";
import "../styles/profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loginHistory, setLoginHistory] = useState([]);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      // Gauti vartotojo duomenis iš Supabase
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setUsername(data.username);
        setWalletAddress(data.wallet_address);
        setLoginHistory(data.login_history || []);
      }

      if (error) console.error("Error fetching profile", error);
    }

    fetchProfile();
  }, [user]);

  function copyToClipboard() {
    navigator.clipboard.writeText(walletAddress);
    alert("Wallet address copied!");
  }

  async function updateProfile() {
    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user.id);

    if (error) alert("Failed to update profile");
    else alert("Profile updated successfully!");
  }

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
  }

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      
      <label>Username:</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={updateProfile}>Save</button>

      <h2>Wallet Address</h2>
      <p>{walletAddress}</p>
      <button onClick={copyToClipboard}>Copy</button>

      <h2>Login Method</h2>
      <p>{user?.provider === "google" ? "Google Login" : "MetaMask"}</p>

      <h2>Recent Logins</h2>
      <ul>
        {loginHistory.map((login, index) => (
          <li key={index}>{login.timestamp} - {login.ip}</li>
        ))}
      </ul>

      <h2>Settings</h2>
      <button onClick={toggleTheme}>Toggle Theme</button>

      <h2>Security</h2>
      <p>2FA Status: <span className="status">Disabled</span></p>
      <button>Enable 2FA (Coming Soon)</button>

      <button className="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
}
