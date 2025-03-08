import { ethers } from "ethers";

const BSC_MAINNET_RPC = "https://bsc-dataseed.binance.org/";
const BSC_TESTNET_RPC = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const NETWORK = process.env.NEXT_PUBLIC_BSC_NETWORK || "mainnet";

export async function connectWallet() {
  try {
    if (!window.ethereum) throw new Error("MetaMask is required to connect.");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return await signer.getAddress();
  } catch (error) {
    console.error("❌ Wallet connection failed:", error);
    return null;
  }
}

export async function getCurrentWallet() {
  try {
    if (!window.ethereum) return null;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return await signer.getAddress();
  } catch (error) {
    console.error("❌ Failed to get current wallet address:", error);
    return null;
  }
}

export async function getBalance(address) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      NETWORK === "mainnet" ? BSC_MAINNET_RPC : BSC_TESTNET_RPC
    );
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error("❌ Failed to get balance:", error);
    return "0";
  }
}

export async function sendTransaction(to, amount) {
  try {
    if (!window.ethereum) throw new Error("MetaMask is required to send transactions.");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tx = await signer.sendTransaction({
      to,
      value: ethers.utils.parseEther(amount),
    });

    return tx.hash;
  } catch (error) {
    console.error("❌ Transaction failed:", error);
    return null;
  }
}
