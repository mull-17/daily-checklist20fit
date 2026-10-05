import { getResetEmail, verifyResetCode, requestResetCode } from './reset-store.js';

const form = document.getElementById('verifyCodeForm');
const codeErr = document.getElementById('code-err');
const message = document.getElementById('message');
const targetEmail = document.getElementById('targetEmail');
const resendBtn = document.getElementById('resendBtn');
const resendTimer = document.getElementById('resendTimer');
const otpInputs = Array.from(document.querySelectorAll('.otp-input'));
const submitBtn = form.querySelector('button[type="submit"]');

const email = getResetEmail();
if (!email) {
  window.location.href = 'forgot-password.html';
} else {
  targetEmail.textContent = email;
}

otpInputs.forEach((input) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 1);
    const i = parseInt(input.dataset.i, 10);
    if (input.value && i < otpInputs.length - 1) {
      otpInputs[i + 1].focus();
    }
    codeErr.classList.remove('show');
    input.classList.remove('err');
  });

  input.addEventListener('keydown', (e) => {
    const i = parseInt(input.dataset.i, 10);
    if (e.key === 'Backspace' && !input.value && i > 0) {
      otpInputs[i - 1].focus();
    }
  });

  input.addEventListener('paste', (e) => {
    const text = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
    if (text.length) {
      e.preventDefault();
      text.split('').slice(0, 6).forEach((ch, idx) => {
        if (otpInputs[idx]) otpInputs[idx].value = ch;
      });
      otpInputs[Math.min(text.length, 5)].focus();
    }
  });
});

let timerHandle = null;
function startResendTimer() {
  let t = 30;
  resendTimer.textContent = t;
  resendBtn.disabled = true;
  clearInterval(timerHandle);
  timerHandle = setInterval(() => {
    t -= 1;
    resendTimer.textContent = t;
    if (t <= 0) {
      clearInterval(timerHandle);
      resendBtn.disabled = false;
      resendBtn.textContent = 'Kirim ulang kode';
    }
  }, 1000);
}
startResendTimer();

resendBtn.addEventListener('click', async () => {
  if (resendBtn.disabled) return;
  resendBtn.disabled = true;
  await requestResetCode(email);
  message.textContent = 'Kode baru terkirim ke email kamu.';
  message.style.color = 'var(--success, #6fcf97)';
  startResendTimer();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const entered = otpInputs.map((i) => i.value).join('');

  if (entered.length < 6) {
    codeErr.textContent = 'Masukkan 6 digit kode';
    codeErr.classList.add('show');
    otpInputs.forEach((i) => i.classList.add('err'));
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Memverifikasi...';

  const result = await verifyResetCode(entered);
  submitBtn.disabled = false;
  submitBtn.textContent = 'Verifikasi';
  if (!result.ok) {
    codeErr.textContent = result.message || 'Kode salah atau sudah kedaluwarsa';
    codeErr.classList.add('show');
    otpInputs.forEach((i) => i.classList.add('err'));
    return;
  }
  clearInterval(timerHandle);
  window.location.href = 'reset-password.html';
});