import { supabase } from "./supabase.js";
console.log("🔥 auth.js berhasil dijalankan!");
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const params = new URLSearchParams(window.location.search);
if (params.get('reset') === 'success') {
  const message = document.getElementById('message');
  const email = params.get('email');
  message.textContent = 'Password berhasil diubah, silakan login dengan password baru.';
  message.style.color = 'var(--success, #6fcf97)';
  if (email) document.getElementById('email').value = email;
}
// ========================================
// FUNGSI CEK ROLE DAN ARAHKAN USER
// ========================================
async function redirectByRole(user) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (error) {
  console.error("❌ ERROR PROFILE:", error);
  console.error("User ID:", user.id);
  console.error("Email:", user.email);

  message.textContent =
    "❌ Profile tidak ditemukan. Cek Console.";

  return;
}
  console.log("User:", user);
  console.log("Role:", profile.role);

  if (profile.role === "hrd") {
    window.location.href = "dashboard.html";
  } else {
    window.location.href = "home.html";
  }
}
// ========================================
// CEK APAKAH SUDAH LOGIN
// ========================================
async function checkSession() {
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (session) {
    console.log("Session ditemukan.");
    await redirectByRole(session.user);
  } else {
    console.log("Belum login.");
  }
}
// Jalankan saat halaman dibuka
checkSession();
// ========================================
// LOGIN
// ========================================

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document
    .getElementById("email")
    .value
    .trim();
  const password = document
    .getElementById("password")
    .value;
  message.textContent = "Sedang login...";
  const {
    data,
    error
  } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    console.error(error);
    message.textContent =
      "❌ Login gagal: " + error.message;
    return;
  }
  message.textContent = "Login berhasil...";
  await redirectByRole(data.user);
});
// Eye Closed 
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const eyeOpen = document.getElementById("eyeOpen");
const eyeClosed = document.getElementById("eyeClosed");
togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password"){
    passwordInput.type = "text";
    eyeOpen.style.display = "none";
    eyeClosed.style.display = "block";
    togglePassword.setAttribute(
      "arial-label",
      "Sembunyikan password"
    );
  }else {
    passwordInput.type = "password";
    eyeOpen.style.display = "block";
    eyeClosed.style.display = "none";
    togglePassword.setAttribute(
      "arial-label",
      "Tampilkan password"
    );
  }
})