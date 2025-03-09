import { supabase } from "@/utils/supabaseClient";
import { generateNewWallet } from "@/utils/wallet";

/**
 * ✅ Prisijungimas su Magic Link
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
 * ✅ Automatinis BSC piniginės priskyrimas vartotojui po prisijungimo
 */
export async function assignWalletToUser(email) {
  try {
    // 1️⃣ Tikrina, ar vartotojas jau turi piniginę DB
    let { data: user, error } = await supabase
      .from("users")
      .select("wallet_address")
      .eq("email", email)
      .single();

    if (error) {
      console.error("❌ Error fetching user data:", error);
      return { success: false, error: error.message };
    }

    // 2️⃣ Jei vartotojas jau turi piniginę → viskas gerai
    if (user?.wallet_address) {
      console.log("✅ User already has wallet:", user.wallet_address);
      return { success: true };
    }

    // 3️⃣ Jei neturi → sugeneruoja naują BSC wallet
    const newWallet = generateNewWallet();
    console.log("🔥 New wallet generated:", newWallet);

    // 4️⃣ Įrašo naują piniginę į DB
    const { error: updateError } = await supabase
      .from("users")
      .update({ wallet_address: newWallet })
      .eq("email", email);

    if (updateError) {
      console.error("❌ Error assigning wallet:", updateError);
      return { success: false, error: updateError.message };
    }

    console.log("✅ Wallet assigned successfully!");
    return { success: true, wallet: newWallet };
  } catch (err) {
    console.error("❌ Unexpected error in assignWalletToUser:", err);
    return { success: false, error: err.message || "Unknown error" };
  }
}
