/**
 * ✅ Nustato, ar vartotojas naudoja mobilų įrenginį.
 * @returns {boolean} - `true` jei mobile, `false` jei ne.
 */
export function detectMobile() {
  return typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

/**
 * ✅ Tikrina, ar el. paštas yra validus.
 * @param {string} email - El. pašto adresas.
 * @returns {boolean} - `true` jei validus, `false` jei ne.
 */
export function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * ✅ Saugus datos formatavimas.
 * @param {string|number|Date} timestamp - Data kaip timestamp, string arba Date objektas.
 * @returns {string} - Formatuota data arba klaida.
 */
export function formatDate(timestamp) {
  if (!timestamp) return "❌ Invalid Date";
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? "❌ Invalid Date" : date.toLocaleString();
}

/**
 * ✅ Sutrumpina Ethereum/BSC adresą.
 * @param {string} address - Pilnas adresas.
 * @returns {string} - Sutrumpintas adresas arba `N/A`, jei blogas.
 */
export function truncateAddress(address) {
  return isValidAddress(address) ? `${address.slice(0, 6)}...${address.slice(-4)}` : "N/A";
}

/**
 * ✅ Konvertuoja WEI į ETH/BNB.
 * @param {string|number} weiValue - WEI kiekis.
 * @param {number} decimals - Po kablelio rodomų skaičių skaičius.
 * @returns {string} - Konvertuota reikšmė.
 */
export function weiToEth(weiValue, decimals = 4) {
  const value = parseFloat(weiValue);
  return isNaN(value) ? "❌ Invalid Value" : (value / 1e18).toFixed(decimals).replace(/\.?0+$/, "");
}

/**
 * ✅ Patikrina, ar tekstas yra validus Ethereum/BSC adresas.
 * @param {string} address - Adresas, kurį norima patikrinti.
 * @returns {boolean} - `true`, jei adresas validus.
 */
export function isValidAddress(address) {
  return typeof address === "string" && /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * ✅ Saugiai formatuoja skaičių su pasirenkamu tikslumu.
 * @param {number|string} number - Skaičius.
 * @param {number} decimals - Kiek skaičių po kablelio rodyti.
 * @returns {string} - Formatuotas skaičius arba klaida.
 */
export function formatNumber(number, decimals = 2) {
  const num = parseFloat(number);
  return isNaN(num) ? "❌ Invalid Number" : num.toLocaleString(undefined, {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals
  });
}

/**
 * ✅ Konvertuoja ETH/BNB į WEI.
 * @param {string|number} ethValue - ETH arba BNB kiekis.
 * @returns {string} - Konvertuota reikšmė arba klaida.
 */
export function ethToWei(ethValue) {
  const value = parseFloat(ethValue);
  return isNaN(value) ? "❌ Invalid Value" : (value * 1e18).toFixed(0);
}

/**
 * ✅ Generuoja unikalų ID.
 * @returns {string} - Unikalus ID.
 */
export function generateUniqueId() {
  return `uid-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

/**
 * ✅ Saugi funkcija konvertuoti datą į timestamp.
 * @param {string|Date} date - Data arba datos string.
 * @returns {number} - Timestamp (milisekundės) arba klaida.
 */
export function dateToTimestamp(date) {
  if (!date) return "❌ Invalid Date";
  const timestamp = Date.parse(date);
  return isNaN(timestamp) ? "❌ Invalid Date" : timestamp;
}
