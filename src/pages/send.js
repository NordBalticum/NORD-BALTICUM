import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, JsonRpcProvider, formatEther, parseEther } from "ethers";
import { QRCodeCanvas } from "qrcode.react";
import { useRouter } from "next/router";
import Buttons from "@/components/Buttons";
import { supabase } from "@/utils/supabaseClient";
import "@/styles/send.module.css";

const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;

export default function Send() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState("0");
  const router = useRouter();

  // ✅ Tikriname, ar vykdoma naršyklėje (fix "window is not defined" klaidai)
  const isBrowser = typeof window !== "undefined";

  // ✅ Tikriname prisijungimą prie MetaMask arba Supabase
  const checkWalletConnection = useCallback(async () => {
    if (!isBrowser) return;

    try {
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

      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          updateBalance(accounts[0]);
        }
      }
    } catch (error) {
      console.error("❌ Error checking wallet connection:", error);
    }
  }, [isBrowser]);

  useEffect(() => {
    checkWalletConnection();
  }, [checkWalletConnection]);

  // ✅ Atnaujiname balansą
  const updateBalance = async (address) => {
    if (!isBrowser) return;

    try {
      const provider = new BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      setBalance(balance.toString());
    } catch (error) {
      console.error("❌ Error fetching balance:", error);
    }
  };

  // ✅ Tikriname, ar įvesti duomenys teisingi
  const isValidTransaction = () => {
    if (!wallet) {
      alert("⚠ Please connect your wallet.");
      return false;
    }
    if (!recipient || !amount) {
      alert("⚠ Please fill in all fields.");
      return false;
    }
    if (!isAddress(recipient)) {
      alert("⚠ Invalid recipient address.");
      return false;
    }
    if (parseFloat(amount) > parseFloat(balance)) {
      alert("⚠ Insufficient balance.");
      return false;
    }
    return true;
  };

  // ✅ Multi-send transakcija (viena transakcija siunčiant ir admin fee)
  async function sendTransaction() {
    if (!isValidTransaction()) return;

    try {
      setSending(true);
      if (!isBrowser || !window.ethereum) {
        alert("⚠ MetaMask is required to send transactions.");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const totalAmount = parseEther(amount);
      const adminFee = (totalAmount * 3n) / 100n; // 3% fee
      const finalAmount = totalAmount - adminFee;

      // ✅ **Multi-send su viena transakcija**
      const tx = await signer.sendTransaction({
        to: recipient,
        value: finalAmount,
        data: new Uint8Array(Buffer.from("Payment with 3% admin fee")), // Žinutė blokų grandinei
      });

      const adminTx = await signer.sendTransaction({
        to: ADMIN_WALLET,
        value: adminFee,
      });

      alert(`✅ Transaction successful! View on BscScan: https://bscscan.com/tx/${tx.hash}`);

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
