import { supabase } from "../supabaseClient";

export async function signInWithMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) console.error("Error sending magic link", error);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error signing out", error);
}

export function getCurrentUser() {
  return supabase.auth.user();
}
