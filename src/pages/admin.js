import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../styles/admin.css";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchTransactions();
  }, []);

  async function fetchUsers() {
    let { data, error } = await supabase.from("profiles").select("*");
    if (!error) setUsers(data);
  }

  async function fetchTransactions() {
    let { data, error } = await supabase.from("transactions").select("*").order("created_at", { ascending: false });
    if (!error) setTransactions(data);
  }

  async function banUser(id) {
    await supabase.from("profiles").update({ banned: true }).eq("id", id);
    fetchUsers();
  }

  async function unbanUser(id) {
    await supabase.from("profiles").update({ banned: false }).eq("id", id);
    fetchUsers();
  }

  async function freezeWallet(id) {
    await supabase.from("profiles").update({ wallet_frozen: true }).eq("id", id);
    fetchUsers();
  }

  async function unfreezeWallet(id) {
    await supabase.from("profiles").update({ wallet_frozen: false }).eq("id", id);
    fetchUsers();
  }

  async function updateAdminFee(fee) {
    await supabase.from("settings").update({ admin_fee: fee }).eq("id", 1);
    alert("Admin fee updated successfully!");
  }

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Wallet</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.email.includes(search) || user.wallet.includes(search))
            .map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.wallet}</td>
                <td>{user.banned ? "BANNED" : "ACTIVE"}</td>
                <td>
                  {user.banned ? (
                    <button onClick={() => unbanUser(user.id)}>Unban</button>
                  ) : (
                    <button onClick={() => banUser(user.id)}>Ban</button>
                  )}
                  {user.wallet_frozen ? (
                    <button onClick={() => unfreezeWallet(user.id)}>Unfreeze</button>
                  ) : (
                    <button onClick={() => freezeWallet(user.id)}>Freeze Wallet</button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.user_id}</td>
              <td>{tx.amount} BNB</td>
              <td>{tx.type}</td>
              <td>{new Date(tx.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Admin Fee</h2>
      <input type="number" placeholder="Set new admin fee %" onBlur={(e) => updateAdminFee(e.target.value)} />
    </div>
  );
}
