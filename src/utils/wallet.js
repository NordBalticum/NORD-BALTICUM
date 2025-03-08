import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask.");
    return null;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  return signer.getAddress();
}

export async function getBalance(address) {
  const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
  const balance = await provider.getBalance(address);
  return ethers.utils.formatEther(balance);
}

export async function sendTransaction(to, amount) {
  if (!window.ethereum) {
    alert("Please install MetaMask.");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const tx = await signer.sendTransaction({
    to,
    value: ethers.utils.parseEther(amount),
  });

  return tx.hash;
}
