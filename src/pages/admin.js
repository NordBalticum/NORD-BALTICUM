import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../styles/admin.css";

export default function Admin() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    async function fetchUsers() {
      let { data, error } = await supabase.from("users").select("*");
      if (error) console.error("Error fetching users:", error);
      else setUsers(data);
    }
    fetchUsers();
  }, []);

  async function toggleBan(userId, isBanned) {
    await supabase
      .from("users")
      .update({ banned: !isBanned })
      .eq("id", userId);
    setUsers(users.map(user => (user.id === userId ? { ...user, banned: !isBanned } : user)));
  }

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Wallet</th>
            <th>Joined</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.wallet || "N/A"}</td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
              <td>{user.banned ? "Banned" : "Active"}</td>
              <td>
                <button onClick={() => toggleBan(user.id, user.banned)}>
                  {user.banned ? "Unban" : "Ban"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
