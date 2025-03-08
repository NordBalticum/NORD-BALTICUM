import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import "../styles/settings.css";

export default function Settings() {
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [theme, setTheme] = useState("dark");

  async function changePassword() {
    if (!user || user.provider !== "email") {
      alert("Password change is only available for email logins.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) alert("Error changing password");
    else alert("Password updated successfully!");
  }

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
  }

  async function deleteAccount() {
    const confirmDelete = confirm("Are you sure you want to delete your account? This action is irreversible!");
    if (!confirmDelete) return;

    const { error } = await supabase.from("profiles").delete().eq("id", user.id);
    if (!error) {
      await supabase.auth.signOut();
      alert("Account deleted successfully.");
    } else {
      alert("Error deleting account.");
    }
  }

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      <h2>Change Password</h2>
      {user?.provider === "email" ? (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={changePassword}>Update Password</button>
        </>
      ) : (
        <p>Password change is not available for social logins.</p>
      )}

      <h2>Theme Settings</h2>
      <button onClick={toggleTheme}>Toggle Theme</button>

      <h2>Security</h2>
      <p>2FA Status: <span className="status">Disabled</span></p>
      <button>Enable 2FA (Coming Soon)</button>

      <h2>Danger Zone</h2>
      <button className="delete-btn" onClick={deleteAccount}>Delete Account</button>

      <button className="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
}
