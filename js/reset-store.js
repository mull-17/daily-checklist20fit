import { supabase } from './supabase-client.js';

const RESET_EMAIL_KEY = '20fit_reset_email';

export async function requestResetCode(email) {
  const cleanEmail = email.trim().toLowerCase();

  const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);

  if (error) {
    return { ok: false, message: error.message };
  }

  sessionStorage.setItem(RESET_EMAIL_KEY, cleanEmail);
  return { ok: true, email: cleanEmail };
}

export function getResetEmail() {
  return sessionStorage.getItem(RESET_EMAIL_KEY);
}

export async function verifyResetCode(code) {
  const email = getResetEmail();
  if (!email) return { ok: false, reason: 'no_session' };

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: 'recovery',
  });

  if (error) {
    return { ok: false, reason: 'mismatch', message: error.message };
  }

  // Setelah verifyOtp sukses, Supabase otomatis bikin session login
  // sementara (dipakai khusus buat update password di langkah berikut).
  return { ok: true, session: data.session };
}

export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  sessionStorage.removeItem(RESET_EMAIL_KEY);
  return { ok: true, email: data.user.email };
}