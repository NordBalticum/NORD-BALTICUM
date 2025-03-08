/**
 * ✅ Formatuoja datą su numatytais arba pasirinktais parametrais.
 * @param {string|number|Date} timestamp - Data kaip timestamp, string arba Date objektas.
 * @param {Object} options - Formato nustatymai (numatytieji: metai, mėnuo, diena, valanda, minutė, sekundė).
 * @returns {string} - Formatuota data arba klaidos pranešimas.
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
  if (isNaN(date.getTime())) return "❌ Invalid Date";

  return date.toLocaleString(undefined, options);
}

/**
 * ✅ Sutrumpina piniginės adresą iki formato: `0x1234...abcd`
 * @param {string} address - Pilnas Ethereum/BSC adresas.
 * @returns {string} - Sutrumpintas adresas arba klaidos pranešimas.
 */
export function truncateAddress(address) {
  if (!address || typeof address !== "string") return "❌ Invalid Address";
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return "❌ Invalid Ethereum Address";

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * ✅ Konvertuoja WEI į ETH/BNB su tikslumu.
 * @param {string|number} weiValue - WEI kiekis.
 * @param {number} decimals - Po kablelio rodomų skaičių skaičius (numatytasis: 4).
 * @returns {string} - Konvertuota reikšmė arba klaida.
 */
export function weiToEth(weiValue, decimals = 4) {
  if (!weiValue || isNaN(weiValue)) return "❌ Invalid Value";
  return (parseFloat(weiValue) / 1e18).toFixed(decimals);
}

/**
 * ✅ Patikrina, ar tekstas yra teisingas Ethereum/BSC adresas.
 * @param {string} address - Adresas, kurį norima patikrinti.
 * @returns {boolean} - `true`, jei adresas validus, `false`, jei ne.
 */
export function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * ✅ Saugiai parodo skaičių su pasirenkamu skaičiumi skaitmenų po kablelio.
 * @param {number|string} number - Skaičius.
 * @param {number} decimals - Kiek skaičių po kablelio rodyti (numatytasis: 2).
 * @returns {string} - Formatuotas skaičius.
 */
export function formatNumber(number, decimals = 2) {
  if (isNaN(number)) return "❌ Invalid Number";
  return Number(number).toFixed(decimals);
}
