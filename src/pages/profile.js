import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
      if (error) console.error(error);
    }
    fetchUser();
  }, []);

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      {user ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Wallet:</strong> {user.wallet || "Not connected"}</p>
          <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
