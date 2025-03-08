import { BrowserProvider, JsonRpcProvider, parseEther, formatEther } from "ethers";

const BSC_MAINNET_RPC = "https://bsc-dataseed.binance.org/";
const BSC_TESTNET_RPC = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const NETWORK = process.env.NEXT_PUBLIC_BSC_NETWORK || "mainnet";

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
 * ✅ Grąžina prijungtą piniginės adresą (jei jau prisijungta).
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
 * ✅ Gauna BNB balansą iš Blockchain pagal adresą.
 * @param {string} address - Piniginės adresas.
 * @returns {Promise<string>} - Balansas BNB formatu.
 */
export async function getBalance(address) {
  try {
    const provider = new JsonRpcProvider(
      NETWORK === "mainnet" ? BSC_MAINNET_RPC : BSC_TESTNET_RPC
    );
    const balance = await provider.getBalance(address);
    return formatEther(balance);
  } catch (error) {
    console.error("❌ Failed to get balance:", error);
    return "0";
  }
}

/**
 * ✅ Siunčia BNB transakciją iš vartotojo piniginės.
 * @param {string} to - Gavėjo adresas.
 * @param {string} amount - Kiekis BNB formatu (pvz., "0.1").
 * @returns {Promise<string|null>} - Transakcijos hash arba null jei nepavyko.
 */
export async function sendTransaction(to, amount) {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("❌ MetaMask is required to send transactions.");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tx = await signer.sendTransaction({
      to,
      value: parseEther(amount),
    });

    return tx.hash;
  } catch (error) {
    console.error("❌ Transaction failed:", error);
    return null;
  }
}

/**
 * ✅ Patikrina, ar vartotojas yra prijungęs MetaMask piniginę.
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
