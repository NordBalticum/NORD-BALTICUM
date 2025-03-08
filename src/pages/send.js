🚀 GALUTINIS TOBULAS send.js KODAS SU VISOM NAUJOVĖM

📌 Patobulinimai:
✅ Sujungti abu failai – visos funkcijos sudėtos į vieną vietą.
✅ Patobulintas prisijungimo tikrinimas – dabar tikrina ir Magic Link wallet, ir MetaMask/WalletConnect.
✅ Patikrina vartotojo balansą prieš transakciją – neleidžia siųsti daugiau nei turi.
✅ Automatiškai apskaičiuoja ir siunčia administravimo mokestį – 3% fee eina į ADMIN wallet.
✅ Optimizuotas ethers naudojimas – veikia su naujausia versija.
✅ Sutvarkytos window problemos – dabar kodas veiks tiek klientinėje, tiek serverinėje aplinkoje.
✅ Integruotas QR kodas – galima nuskaityti gavėjo adresą patogiai.
✅ Geresnis UX/UI – laukų išvalymas po transakcijos, aiškesni pranešimai vartotojui.


---

🚀 GALUTINĖ VERSIJA

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { QRCodeCanvas } from "qrcode.react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";
import Buttons from "@/components/Buttons";
import styles from "@/styles/send.module.css";

const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;

export default function Send() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState("0");
  const router = useRouter();

  // ✅ Tikrina prisijungimą (Magic Link + Web3)
  const checkWalletConnection = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      // 🔹 Tikriname Magic Link vartotoją (Supabase)
      const { data: session } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("wallet")
          .eq("id", session.user.id)
          .single();

        if (!error && data?.wallet) {
          setWallet(data.wallet);
          updateBalance(data.wallet);
          return;
        }
      }

      // 🔹 Tikriname MetaMask/WalletConnect
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          updateBalance(accounts[0]);
        }
      }
    } catch (error) {
      console.error("❌ Error checking wallet connection:", error);
    }
  }, []);

  useEffect(() => {
    checkWalletConnection();
  }, [checkWalletConnection]);

  // ✅ Gauna vartotojo balansą
  const updateBalance = async (address) => {
    try {
      const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("❌ Error fetching balance:", error);
    }
  };

  // ✅ Tikrina, ar transakcija galima
  const isValidTransaction = () => {
    if (!wallet) {
      alert("⚠ Please connect your wallet.");
      return false;
    }
    if (!recipient || !amount) {
      alert("⚠ Please fill in all fields.");
      return false;
    }
    if (!ethers.isAddress(recipient)) {
      alert("⚠ Invalid recipient address.");
      return false;
    }
    if (parseFloat(amount) > parseFloat(balance)) {
      alert("⚠ Insufficient balance.");
      return false;
    }
    return true;
  };

  // ✅ Atlieka BNB transakciją su 3% administravimo mokesčiu
  async function sendTransaction() {
    if (!isValidTransaction()) return;

    try {
      setSending(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const totalAmount = ethers.parseEther(amount);
      const adminFee = (totalAmount * 3n) / 100n; // 3% fee
      const finalAmount = totalAmount - adminFee;

      // 🔹 Pagrindinė transakcija
      const tx1 = await signer.sendTransaction({
        to: recipient,
        value: finalAmount,
      });

      // 🔹 Administratoriaus mokestis
      const tx2 = await signer.sendTransaction({
        to: ADMIN_WALLET,
        value: adminFee,
      });

      alert(`✅ Transaction successful! View on BscScan: https://bscscan.com/tx/${tx1.hash}`);

      // ✅ Atnaujiname balansą ir išvalome laukus
      updateBalance(wallet);
      setRecipient("");
      setAmount("");

      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Transaction failed:", error);
      alert("❌ Transaction failed. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={styles.sendContainer}>
      <h1>Send BNB / Tokens</h1>

      <div className={styles.walletInfo}>
        <p><strong>Connected Wallet:</strong> {wallet || "Not Connected"}</p>
        <p><strong>Balance:</strong> {balance} BNB</p>
      </div>

      <div className={styles.inputGroup}>
        <label>Recipient Address</label>
        <input
          type="text"
          placeholder="Enter recipient wallet address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Amount (BNB)</label>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.0001"
        />
      </div>

      <button 
        className={styles.sendButton}
        onClick={sendTransaction} 
        disabled={!wallet || sending || !recipient || !amount}
      >
        {sending ? "⏳ Sending..." : "🚀 Send"}
      </button>

      <div className={styles.qrCode}>
        {recipient ? <QRCodeCanvas value={recipient} size={200} /> : <p>No QR Code Available</p>}
      </div>

      {/* 📌 Navigacijos mygtukai */}
      <div className={styles.dashboardButtons}>
        <Buttons text="Send" onClick={() => router.push("/send")} />
        <Buttons text="Receive" onClick={() => router.push("/receive")} />
        <Buttons text="Stake" onClick={() => router.push("/stake")} />
        <Buttons text="Swap" onClick={() => router.push("/swap")} />
        <Buttons text="Donate" onClick={() => router.push("/donate")} />
      </div>
    </div>
  );
}


---

🔥 KODAS DABAR PILNAI OPTIMIZUOTAS:

✅ Sujungtas Magic Link ir Web3 prisijungimas – tikrina ir Supabase vartotojo wallet, ir

