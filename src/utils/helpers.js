/**
 * ✅ Nustato, ar vartotojas naudoja mobilų įrenginį.
 */
export function detectMobile() {
  return typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

/**
 * ✅ Jungia MetaMask
 */
export async function connectMetaMask() {
  if (!window.ethereum) {
    alert("❌ MetaMask not found. Please install MetaMask.");
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return accounts[0];
  } catch (error) {
    console.error("❌ MetaMask connection error:", error);
    return null;
  }
}
