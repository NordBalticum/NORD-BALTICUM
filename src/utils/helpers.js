export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString();
}

export function truncateAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
