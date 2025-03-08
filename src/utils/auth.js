import { supabase } from "../utils/supabaseClient";

export async function signInWithMagicLink(email) {
  try {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      console.error("Error sending magic link:", error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in signInWithMagicLink:", err);
    return { success: false, error: err };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in signOut:", err);
    return { success: false, error: err };
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
    return data.user;
  } catch (err) {
    console.error("Unexpected error in getCurrentUser:", err);
    return null;
  }
}
