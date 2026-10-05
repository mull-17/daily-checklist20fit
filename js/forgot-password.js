import { requestResetCode } from './reset-store.js';

const form = document.getElementById('forgotPasswordForm');
const emailInput = document.getElementById('email');
const emailErr = document.getElementById('email-err');
const message = document.getElementById('message');
const submitBtn = form.querySelector('button[type="submit"]');

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

emailInput.addEventListener('input', () => {
  emailErr.classList.remove('show');
  emailInput.classList.remove('err');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();

  if (!validEmail(email)) {
    emailErr.classList.add('show');
    emailInput.classList.add('err');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Mengirim...';
  message.textContent = '';

  const result = await requestResetCode(email);

  submitBtn.disabled = false;
  submitBtn.textContent = 'Kirim kode reset';

  if (!result.ok) {
    message.textContent = result.message || 'Gagal mengirim kode, coba lagi.';
    message.style.color = 'var(--error, #ef6b6b)';
    return;
  }

  message.textContent = 'Kode verifikasi terkirim ke email kamu.';
  message.style.color = 'var(--success, #6fcf97)';

  setTimeout(() => {
    window.location.href = 'verify-code.html';
  }, 500);
});