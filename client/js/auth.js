// ============================================================
// Handles the login and register forms
// ============================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setFieldError(inputEl, message) {
  const errorEl = inputEl.parentElement.querySelector('.error-text') || inputEl.closest('div').parentElement.querySelector('.error-text');
  if (errorEl) {
    if (message) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
      inputEl.classList.add('border-red-400');
    } else {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
      inputEl.classList.remove('border-red-400');
    }
  }
}

// If an already-authenticated admin lands on login/register, send them to the dashboard
if (getToken() && (window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('register.html'))) {
  window.location.href = 'dashboard.html';
}

// --------------------------------------------------------------
// LOGIN
// --------------------------------------------------------------
const loginForm = document.getElementById('login-form');
if (loginForm) {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const toggleBtn = document.getElementById('toggle-password');
  const loginBtn = document.getElementById('login-btn');

  toggleBtn?.addEventListener('click', () => {
    const isPwd = passwordInput.type === 'password';
    passwordInput.type = isPwd ? 'text' : 'password';
    toggleBtn.textContent = isPwd ? 'Hide' : 'Show';
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    if (!EMAIL_REGEX.test(emailInput.value.trim())) {
      setFieldError(emailInput, 'Please enter a valid email address.');
      valid = false;
    } else {
      setFieldError(emailInput, '');
    }

    if (!passwordInput.value) {
      setFieldError(passwordInput, 'Password is required.');
      valid = false;
    } else {
      setFieldError(passwordInput, '');
    }

    if (!valid) return;

    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span>Signing in...</span>';

    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email: emailInput.value.trim(), password: passwordInput.value }
      });
      setSession(res.data.token, res.data.admin);
      showToast('Welcome back! Redirecting...', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 500);
    } catch (err) {
      showToast(err.message, 'error');
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<span>Sign In</span>';
    }
  });
}

// --------------------------------------------------------------
// REGISTER
// --------------------------------------------------------------
const registerForm = document.getElementById('register-form');
if (registerForm) {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirm-password');
  const registerBtn = document.getElementById('register-btn');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    if (nameInput.value.trim().length < 2) {
      setFieldError(nameInput, 'Name must be at least 2 characters.');
      valid = false;
    } else setFieldError(nameInput, '');

    if (!EMAIL_REGEX.test(emailInput.value.trim())) {
      setFieldError(emailInput, 'Please enter a valid email address.');
      valid = false;
    } else setFieldError(emailInput, '');

    if (passwordInput.value.length < 6) {
      setFieldError(passwordInput, 'Password must be at least 6 characters.');
      valid = false;
    } else setFieldError(passwordInput, '');

    if (confirmInput.value !== passwordInput.value) {
      setFieldError(confirmInput, 'Passwords do not match.');
      valid = false;
    } else setFieldError(confirmInput, '');

    if (!valid) return;

    registerBtn.disabled = true;
    registerBtn.textContent = 'Creating account...';

    try {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: { name: nameInput.value.trim(), email: emailInput.value.trim(), password: passwordInput.value }
      });
      setSession(res.data.token, res.data.admin);
      showToast('Account created! Redirecting...', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 500);
    } catch (err) {
      showToast(err.message, 'error');
      registerBtn.disabled = false;
      registerBtn.textContent = 'Create Account';
    }
  });
}
