import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import "@/styles/settings.css";

export default function Settings() {
  const { user, logout } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [theme, setTheme] = useState("dark");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Gauti saugomą temą iš localStorage
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.body.setAttribute("data-theme", savedTheme);
  }, []);

  async function changePassword() {
    if (!user || user.provider !== "email") {
      alert("Password change is only available for email logins.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert("Error changing password. Please try again.");
    } else {
      alert("Password updated successfully!");
      setNewPassword("");
    }
  }

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }

  async function deleteAccount() {
    const confirmDelete = confirm("Are you sure you want to delete your account? This action is irreversible!");
    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase.from("profiles").delete().eq("id", user.id);
      if (!error) {
        await supabase.auth.signOut();
        alert("Account deleted successfully.");
      } else {
        alert("Error deleting account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      {/* ✅ Password Change */}
      <h2>Change Password</h2>
      {user?.provider === "email" ? (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={changePassword} disabled={!newPassword}>Update Password</button>
        </>
      ) : (
        <p>Password change is not available for social logins.</p>
      )}

      {/* ✅ Theme Settings */}
      <h2>Theme Settings</h2>
      <button onClick={toggleTheme}>Toggle Theme</button>

      {/* ✅ Security Settings */}
      <h2>Security</h2>
      <p>2FA Status: <span className="status">Disabled</span></p>
      <button disabled>Enable 2FA (Coming Soon)</button>

      {/* ✅ Danger Zone */}
      <h2 className="danger-zone">Danger Zone</h2>
      <button className="delete-btn" onClick={deleteAccount} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete Account"}
      </button>

      {/* ✅ Logout */}
      <button className="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
}
