import { supabase } from "@/utils/supabaseClient";
import { connectWallet } from "@/utils/wallet";

/**
 * ✅ Prisijungimas su Magic Link (OTP)
 * - Siunčia prisijungimo nuorodą el. paštu
 * - Jei sėkminga autentifikacija, patikrina ir priskiria Web3 piniginę
 */
export async function signInWithMagicLink(email) {
  try {
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      console.error("❌ Error sending magic link:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ Magic Link sent successfully!");
    return { success: true };
  } catch (err) {
    console.error("❌ Unexpected error in signInWithMagicLink:", err);
    return { success: false, error: err.message || "Unknown error" };
  }
}

/**
 * ✅ Registracija su Magic Link
 * - Sukuria naują naudotoją per Supabase
 * - Automatiškai priskiria Web3 piniginės adresą
 */
export async function signUpWithMagicLink(email) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      console.error("❌ Error sending magic link:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ Magic Link sent successfully!");

    // ✅ Prisijungus, automatiškai priskiriame Web3 piniginės adresą
    const address = await connectWallet();
    if (address) {
      await saveWalletToDB(address);
    }

    return { success: true };
  } catch (err) {
    console.error("❌ Unexpected error in signUpWithMagicLink:", err);
    return { success: false, error: err.message || "Unknown error" };
  }
}

/**
 * ✅ Atsijungimo funkcija
 * - Atsijungia iš Supabase ir išvalo naudotojo duomenis
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("❌ Error signing out:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ Successfully signed out!");
    return { success: true };
  } catch (err) {
    console.error("❌ Unexpected error in signOut:", err);
    return { success: false, error: err.message || "Unknown error" };
  }
}

/**
 * ✅ Gauna dabartinį vartotoją
 * - Jei prisijungęs, grąžina vartotojo duomenis
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("❌ Error fetching current user:", error);
      return null;
    }

    return data.user;
  } catch (err) {
    console.error("❌ Unexpected error in getCurrentUser:", err);
    return null;
  }
}

/**
 * ✅ Priskiria piniginės adresą vartotojui ir išsaugo Supabase DB
 */
export async function saveWalletToDB(address) {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return;

    const { error } = await supabase
      .from("users") // 🔹 Pakeisk į savo lentelės pavadinimą
      .update({ wallet: address })
      .eq("id", user.data.user.id);

    if (error) {
      console.error("❌ Error saving wallet:", error);
    } else {
      console.log("✅ Wallet saved successfully!");
    }
  } catch (error) {
    console.error("❌ Unexpected error in saveWalletToDB:", error);
  }
}
