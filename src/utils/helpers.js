/**
 * ✅ Nustato, ar vartotojas naudoja mobilų įrenginį.
 * @returns {boolean} - `true` jei mobile, `false` jei ne.
 */
export function detectMobile() {
  if (typeof navigator !== "undefined") {
    return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
  }
  return false;
}

/**
 * ✅ Saugus datos formatavimas.
 * @param {string|number|Date} timestamp - Data kaip timestamp, string arba Date objektas.
 * @param {Object} options - Formato nustatymai.
 * @returns {string} - Formatuota data.
 */
export function formatDate(
  timestamp,
  options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }
) {
  if (!timestamp) return "❌ Invalid Date";
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? "❌ Invalid Date" : date.toLocaleString(undefined, options);
}

/**
 * ✅ Sutrumpina Ethereum/BSC adresą.
 * @param {string} address - Pilnas adresas.
 * @returns {string} - Sutrumpintas adresas.
 */
export function truncateAddress(address) {
  return isValidAddress(address) ? `${address.slice(0, 6)}...${address.slice(-4)}` : "❌ Invalid Address";
}

/**
 * ✅ Konvertuoja WEI į ETH/BNB.
 * @param {string|number} weiValue - WEI kiekis.
 * @param {number} decimals - Po kablelio rodomų skaičių skaičius.
 * @returns {string} - Konvertuota reikšmė.
 */
export function weiToEth(weiValue, decimals = 4) {
  if (!weiValue || isNaN(weiValue)) return "❌ Invalid Value";
  return (parseFloat(weiValue) / 1e18).toFixed(decimals).replace(/\.?0+$/, ""); // 🔥 Pašalina nereikalingus nulius
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
 * ✅ Saugiai formatuoja skaičių su pasirenkamu tikslumu.
 * @param {number|string} number - Skaičius.
 * @param {number} decimals - Kiek skaičių po kablelio rodyti.
 * @returns {string} - Formatuotas skaičius.
 */
export function formatNumber(number, decimals = 2) {
  return isNaN(number) ? "❌ Invalid Number" : Number(number).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * ✅ Konvertuoja ETH/BNB į WEI.
 * @param {string|number} ethValue - ETH arba BNB kiekis.
 * @returns {string} - Konvertuota reikšmė.
 */
export function ethToWei(ethValue) {
  if (!ethValue || isNaN(ethValue)) return "❌ Invalid Value";
  return (parseFloat(ethValue) * 1e18).toFixed(0);
}

/**
 * ✅ Generuoja trumpą, unikalų identifikatorių.
 * @returns {string} - Unikalus ID.
 */
export function generateUniqueId() {
  return `uid-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * ✅ Saugi funkcija konvertuoti datą į timestamp.
 * @param {string|Date} date - Data arba datos string.
 * @returns {number} - Timestamp (milisekundės).
 */
export function dateToTimestamp(date) {
  if (!date) return "❌ Invalid Date";
  const timestamp = new Date(date).getTime();
  return isNaN(timestamp) ? "❌ Invalid Date" : timestamp;
}
