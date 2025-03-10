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
 * @param {Object} options - Formato nustatymai.
 * @returns {string} - Formatuota data arba klaida.
 */
export function formatDate(timestamp, options = {
  year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
}) {
  try {
    if (!timestamp) throw new Error("Invalid Date");
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) throw new Error("Invalid Date");
    return date.toLocaleString(undefined, options);
  } catch (error) {
    return `❌ ${error.message}`;
  }
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
  try {
    const value = parseFloat(weiValue);
    if (isNaN(value) || value < 0) throw new Error("Invalid Value");
    return (value / 1e18).toFixed(decimals).replace(/\.?0+$/, "");
  } catch (error) {
    return `❌ ${error.message}`;
  }
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
  try {
    const num = parseFloat(number);
    if (isNaN(num)) throw new Error("Invalid Number");
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  } catch (error) {
    return `❌ ${error.message}`;
  }
}

/**
 * ✅ Konvertuoja ETH/BNB į WEI.
 * @param {string|number} ethValue - ETH arba BNB kiekis.
 * @returns {string} - Konvertuota reikšmė arba klaida.
 */
export function ethToWei(ethValue) {
  try {
    const value = parseFloat(ethValue);
    if (isNaN(value) || value < 0) throw new Error("Invalid Value");
    return (value * 1e18).toFixed(0);
  } catch (error) {
    return `❌ ${error.message}`;
  }
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
  try {
    if (!date) throw new Error("Invalid Date");
    const timestamp = Date.parse(date);
    if (isNaN(timestamp)) throw new Error("Invalid Date");
    return timestamp;
  } catch (error) {
    return `❌ ${error.message}`;
  }
}
