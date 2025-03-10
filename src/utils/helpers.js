export function detectMobile() {
  return typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

export function isValidAddress(address) {
  return typeof address === "string" && /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function formatDate(timestamp, options = {
  year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
}) {
  if (!timestamp) return "❌ Invalid Date";
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? "❌ Invalid Date" : date.toLocaleString(undefined, options);
}

export function truncateAddress(address) {
  return isValidAddress(address) ? `${address.slice(0, 6)}...${address.slice(-4)}` : "N/A";
}

export function weiToEth(weiValue, decimals = 4) {
  const value = parseFloat(weiValue);
  return isNaN(value) ? "❌ Invalid Value" : (value / 1e18).toFixed(decimals).replace(/\.?0+$/, "");
}

export function ethToWei(ethValue) {
  const value = parseFloat(ethValue);
  return isNaN(value) ? "❌ Invalid Value" : (value * 1e18).toFixed(0);
}

export function generateUniqueId() {
  return `uid-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

export function dateToTimestamp(date) {
  if (!date) return "❌ Invalid Date";
  const timestamp = Date.parse(date);
  return isNaN(timestamp) ? "❌ Invalid Date" : timestamp;
}
