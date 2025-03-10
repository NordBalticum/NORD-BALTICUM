/**
 * ✅ Nustato, ar vartotojas naudoja mobilų įrenginį.
 * @returns {boolean} - `true` jei mobile, `false` jei ne.
 */
export function detectMobile() {
  if (typeof navigator !== "undefined" && navigator.userAgent) {
    return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
  }
  return false;
}

/**
 * ✅ Saugus datos formatavimas.
 * @param {string|number|Date} timestamp - Data kaip timestamp, string arba Date objektas.
 * @returns {string} - Formatuota data.
 */
export function formatDate(timestamp) {
  if (!timestamp) return "❌ Invalid Date";
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? "❌ Invalid Date" : date.toLocaleString();
}

/**
 * ✅ Sutrumpina Ethereum/BSC adresą.
 * @param {string} address - Pilnas adresas.
 * @returns {string} - Sutrumpintas adresas.
 */
export function truncateAddress(address) {
  return isValidAddress(address) ? `${address.slice(0, 6)}...${address.slice(-4)}` : "N/A";
}

/**
 * ✅ Patikrina, ar tekstas yra validus Ethereum/BSC adresas.
 * @param {string} address - Adresas, kurį norima patikrinti.
 * @returns {boolean} - `true`, jei adresas validus.
 */
export function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * ✅ Konvertuoja WEI į ETH/BNB.
 * @param {string|number} weiValue - WEI kiekis.
 * @param {number} decimals - Po kablelio rodomų skaičių skaičius.
 * @returns {string} - Konvertuota reikšmė.
 */
export function weiToEth(weiValue, decimals = 4) {
  const value = parseFloat(weiValue);
  return isNaN(value) ? "❌ Invalid Value" : (value / 1e18).toFixed(decimals);
}

/**
 * ✅ Konvertuoja ETH/BNB į WEI.
 * @param {string|number} ethValue - ETH arba BNB kiekis.
 * @returns {string} - Konvertuota reikšmė.
 */
export function ethToWei(ethValue) {
  const value = parseFloat(ethValue);
  return isNaN(value) ? "❌ Invalid Value" : (value * 1e18).toFixed(0);
}

/**
 * ✅ Saugi funkcija konvertuoti datą į timestamp.
 * @param {string|Date} date - Data arba datos string.
 * @returns {number} - Timestamp (milisekundės).
 */
export function dateToTimestamp(date) {
  const timestamp = Date.parse(date);
  return isNaN(timestamp) ? "❌ Invalid Date" : timestamp;
}

/**
 * ✅ Generuoja unikalų ID.
 * @returns {string} - Unikalus ID.
 */
export function generateUniqueId() {
  return `uid-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}
