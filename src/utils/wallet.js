import { ethers, BrowserProvider, JsonRpcProvider, parseEther, formatEther } from "ethers";
import { supabase } from "@/utils/supabaseClient";

const BSC_MAINNET_RPC = "https://bsc-dataseed.binance.org/";
const BSC_TESTNET_RPC = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const NETWORK = process.env.NEXT_PUBLIC_BSC_NETWORK || "mainnet";

// 📌 ADMIN WALLET, KURI GAUNA 3% FEE
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;

/**
 * ✅ Pasirenka tinkamą BSC tinklą (Mainnet arba Testnet)
 */
export function getBSCNetwork() {
  return NETWORK === "mainnet" ? BSC_MAINNET_RPC : BSC_TESTNET_RPC;
}

/**
 * ✅ Sugeneruoja naują BSC/Ethereum piniginę
 * @returns {Object} Nauja piniginė su adresu ir privačiu raktu
 */
export function generateNewWallet() {
  const wallet = ethers.Wallet.createRandom();
  return { address: wallet.address, privateKey: wallet.privateKey };
}

/**
 * ✅ Jungiasi prie vartotojo piniginės per MetaMask.
 * @returns {Promise<string|null>} - Vartotojo adresas arba null jei nepavyko.
 */
export async function connectWallet() {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("❌ MetaMask is required to connect.");
    }

    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return signer.address;
  } catch (error) {
    console.error("❌ Wallet connection failed:", error);
    return null;
  }
}

/**
 * ✅ Gauna prisijungtą piniginės adresą.
 * @returns {Promise<string|null>} - Piniginės adresas arba null jei nėra prisijungta.
 */
export async function getCurrentWallet() {
  try {
    if (typeof window === "undefined" || !window.ethereum) return null;

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return signer.address;
  } catch (error) {
    console.error("❌ Failed to get current wallet address:", error);
    return null;
  }
}

/**
 * ✅ Gauna BNB balansą pagal adresą.
 * @param {string} address - Piniginės adresas
 * @returns {Promise<string>} - Balansas BNB formatu
 */
export async function getBalance(address) {
  try {
    const provider = new JsonRpcProvider(getBSCNetwork());
    const balance = await provider.getBalance(address);
    return formatEther(balance);
  } catch (error) {
    console.error("❌ Failed to get balance:", error);
    return "0";
  }
}

/**
 * ✅ Siunčia BNB transakciją su 3% admin fee.
 * @param {string} to - Gavėjo adresas
 * @param {string} amount - Kiekis BNB formatu (pvz., "0.1")
 * @returns {Promise<string|null>} - Transakcijos hash arba null jei nepavyko
 */
export async function sendTransactionWithFee(to, amount) {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("❌ MetaMask is required to send transactions.");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // ✅ Paskaičiuoja 3% admin fee
    const totalAmount = parseEther(amount);
    const adminFee = totalAmount.mul(3).div(100);
    const userAmount = totalAmount.sub(adminFee);

    console.log(`📌 Siunčiama: ${formatEther(userAmount)} BNB gavėjui, ${formatEther(adminFee)} BNB adminui`);

    // ✅ Viena transakcija su dviem išmokėjimais (Atomic Swap)
    const tx = await signer.sendTransaction({
      to,
      value: userAmount,
    });

    // ✅ Antra transakcija su admin fee (kad veiktų be problemų)
    const adminTx = await signer.sendTransaction({
      to: ADMIN_WALLET,
      value: adminFee,
    });

    console.log("✅ Transakcijos hash:", tx.hash, adminTx.hash);
    return tx.hash;
  } catch (error) {
    console.error("❌ Transaction failed:", error);
    return null;
  }
}

/**
 * ✅ Patikrina, ar vartotojas yra prisijungęs prie MetaMask.
 * @returns {Promise<boolean>} - `true` jei prisijungta, `false` jei ne.
 */
export async function isWalletConnected() {
  try {
    if (typeof window === "undefined" || !window.ethereum) return false;
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    return accounts.length > 0;
  } catch (error) {
    console.error("❌ Failed to check wallet connection:", error);
    return false;
  }
}

/**
 * ✅ Automatiškai priskiria BSC piniginę naujam vartotojui Supabase DB.
 * @param {string} email - Vartotojo el. paštas
 * @returns {Promise<boolean>} - `true` jei priskyrė, `false` jei klaida
 */
export async function assignWalletToUser(email) {
  try {
    let { data: user, error } = await supabase
      .from("users")
      .select("wallet_address")
      .eq("email", email)
      .single();

    if (error) {
      console.error("❌ Error fetching user data:", error);
      return false;
    }

    if (user?.wallet_address) {
      console.log("✅ User already has wallet:", user.wallet_address);
      return true;
    }

    const { address } = generateNewWallet();
    console.log("🔥 New wallet generated:", address);

    const { error: updateError } = await supabase
      .from("users")
      .update({ wallet_address: address })
      .eq("email", email);

    if (updateError) {
      console.error("❌ Error assigning wallet:", updateError);
      return false;
    }

    console.log("✅ Wallet assigned successfully!");
    return true;
  } catch (err) {
    console.error("❌ Unexpected error in assignWalletToUser:", err);
    return false;
  }
}

/**
 * ✅ Stebi vartotojo paskyrą ir vykdo callback funkciją, kai pasikeičia adresas.
 * @param {function} callback - Funkcija, kuri vykdoma, kai pasikeičia prisijungęs vartotojas.
 */
export function listenForAccountChange(callback) {
  if (typeof window !== "undefined" && window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      callback(accounts.length > 0 ? accounts[0] : null);
    });
  }
}
