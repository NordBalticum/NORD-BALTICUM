export function formatDate(timestamp, options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) {
  if (!timestamp) return "Invalid Date";
  return new Date(timestamp).toLocaleString(undefined, options);
}

export function truncateAddress(address) {
  if (!address || address.length < 10) return "Invalid Address";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
