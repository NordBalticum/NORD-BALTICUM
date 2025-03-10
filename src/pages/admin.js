import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";
import NetworkSwitcher from "@/components/NetworkSwitcher";
import styles from "@/styles/admin.module.css";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [adminFee, setAdminFee] = useState("");
  const [compensateAmount, setCompensateAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      await fetchUsers();
      await fetchTransactions();
      await fetchAdminFee();
      setLoading(false);
    }
    fetchData();
  }, []);

  async function fetchUsers() {
    let { data, error } = await supabase.from("profiles").select("*");
    if (!error) setUsers(data);
  }

  async function fetchTransactions() {
    let { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setTransactions(data);
  }

  async function fetchAdminFee() {
    let { data, error } = await supabase.from("settings").select("admin_fee").eq("id", 1).single();
    if (!error) setAdminFee(data.admin_fee);
  }

  async function updateAdminFee(fee) {
    if (isNaN(fee) || fee < 0) {
      alert("Invalid fee value!");
      return;
    }
    await supabase.from("settings").update({ admin_fee: fee }).eq("id", 1);
    setAdminFee(fee);
    alert("✅ Admin fee updated successfully!");
  }

  async function toggleBan(id, banned) {
    await supabase.from("profiles").update({ banned: !banned }).eq("id", id);
    fetchUsers();
  }

  async function toggleFreezeWallet(id, walletFrozen) {
    await supabase.from("profiles").update({ wallet_frozen: !walletFrozen }).eq("id", id);
    fetchUsers();
  }

  async function compensateFunds(id) {
    if (!compensateAmount || isNaN(compensateAmount) || compensateAmount <= 0) {
      alert("⚠️ Please enter a valid amount.");
      return;
    }
    await supabase.from("transactions").insert([{ user_id: id, amount: compensateAmount, type: "compensation" }]);
    alert(`💰 Successfully compensated ${compensateAmount} BNB to user!`);
    setCompensateAmount("");
    fetchTransactions();
  }

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>🚀 Admin Panel</h1>

      {loading ? <p className={styles.loading}>Loading...</p> : (
        <>
          <NetworkSwitcher />

          {/* ✅ USER SEARCH */}
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="🔍 Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* ✅ USERS LIST */}
          <h2 className={styles.sectionTitle}>👥 Users</h2>
          <table className={styles.adminTable}>
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
                    <td className={user.banned ? styles.banned : styles.active}>
                      {user.banned ? "BANNED" : "ACTIVE"}
                    </td>
                    <td>
                      <button
                        className={styles.actionButton}
                        onClick={() => toggleBan(user.id, user.banned)}
                      >
                        {user.banned ? "Unban" : "Ban"}
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => toggleFreezeWallet(user.id, user.wallet_frozen)}
                      >
                        {user.wallet_frozen ? "Unfreeze" : "Freeze"}
                      </button>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={compensateAmount}
                        onChange={(e) => setCompensateAmount(e.target.value)}
                      />
                      <button className={styles.compensateButton} onClick={() => compensateFunds(user.id)}>Compensate</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* ✅ TRANSACTIONS */}
          <h2 className={styles.sectionTitle}>📜 Transactions</h2>
          <table className={styles.adminTable}>
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

          {/* ✅ ADMIN FEE */}
          <h2 className={styles.sectionTitle}>⚙️ Admin Fee</h2>
          <input
            type="number"
            placeholder="Set new admin fee %"
            value={adminFee}
            onChange={(e) => setAdminFee(e.target.value)}
            onBlur={(e) => updateAdminFee(e.target.value)}
          />
        </>
      )}
    </div>
  );
}
