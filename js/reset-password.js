import { updatePassword } from './reset-store.js';

const form = document.getElementById('resetPasswordForm');
const newPassword = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');
const newPasswordErr = document.getElementById('newPassword-err');
const confirmPasswordErr = document.getElementById('confirmPassword-err');
const message = document.getElementById('message');
const strengthBars = document.querySelectorAll('#strengthBars div');

document.querySelectorAll('.password-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    input.type = input.type === 'password' ? 'text' : 'password';
  });
});

function passwordScore(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

newPassword.addEventListener('input', () => {
  const score = passwordScore(newPassword.value);
  const colors = ['#e0332f', '#e0332f', '#e8b339', '#6fcf97'];
  strengthBars.forEach((bar, idx) => {
    bar.style.background = idx < score ? colors[Math.max(score - 1, 0)] : 'var(--input-border, #2b3350)';
  });
  newPasswordErr.classList.remove('show');
});

confirmPassword.addEventListener('input', () => {
  confirmPasswordErr.classList.remove('show');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  let ok = true;

  if (newPassword.value.length < 8) {
    newPasswordErr.classList.add('show');
    ok = false;
  }

  if (confirmPassword.value !== newPassword.value || confirmPassword.value.length === 0) {
    confirmPasswordErr.classList.add('show');
    ok = false;
  }

  if (!ok) return;

  const result = await updatePassword(newPassword.value);
  if (!result.ok) {
    message.textContent = result.message || 'Sesi reset password sudah tidak berlaku, coba lagi dari awal.';
    message.style.color = 'var(--error, #ef6b6b)';
    return;
  }

  window.location.href = `index.html?reset=success&email=${encodeURIComponent(result.email)}`;
});