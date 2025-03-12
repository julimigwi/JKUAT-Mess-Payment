// Utility Functions
function showLoading(show) {
  document.querySelector('.loading-overlay').style.display = show ? 'flex' : 'none';
}

function showError(fieldId, message) {
  const errorElement = document.getElementById(`${fieldId}-error`);
  const inputField = document.getElementById(fieldId);
  
  errorElement.textContent = message;
  errorElement.style.display = message ? 'block' : 'none';
  inputField.style.borderColor = message ? '#dc3545' : '#ddd';
}

// Form Validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

function validatePassword(password) {
  return password.length >= 8;
}

// Password Visibility Toggle
function togglePassword(fieldId) {
  const passwordField = document.getElementById(fieldId);
  const toggleIcon = passwordField.parentNode.querySelector('.toggle-password');
  
  if (passwordField.type === 'password') {
    passwordField.type = 'text';
    toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    passwordField.type = 'password';
    toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}
// Forgot Password Handler
async function handleForgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById('forgot-email').value;

  if (!validateEmail(email)) {
    return showError('forgot-email', 'Please enter a valid email address');
  }

  try {
    await handleRequest('/forgot-password', 'POST', { email });
    alert('Password reset link sent to your email');
    switchForm('login');
  } catch (error) {
    showError('forgot-email', error.message);
  }
}

// Reset Password Handler
async function handleResetPassword(event) {
  event.preventDefault();
  const password = document.getElementById('reset-password').value;
  const confirmPassword = document.getElementById('reset-confirm-password').value;
  const token = new URLSearchParams(window.location.search).get('token');

  if (!token) {
    return alert('Invalid reset token');
  }

  if (password !== confirmPassword) {
    return showError('reset-confirm-password', 'Passwords do not match');
  }

  if (!validatePassword(password)) {
    return showError('reset-password', 'Minimum 8 characters required');
  }

  try {
    await handleRequest(`/reset-password/${token}`, 'PATCH', { password });
    alert('Password reset successfully!');
    window.location.href = '/login';
  } catch (error) {
    showError('reset-password', error.message);
  }
}

// Update Event Listeners
document.getElementById('forgot-form').addEventListener('submit', handleForgotPassword);
document.getElementById('reset-form').addEventListener('submit', handleResetPassword);

// Check for Reset Token on Page Load
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get('token');
  
  if (resetToken && window.location.pathname === '/reset-password') {
    switchForm('reset');
    document.getElementById('reset-form').classList.add('active');
  }
});


// Form Switching
function switchForm(formType) {
  document.querySelectorAll('.auth-form').forEach(form => {
    form.classList.remove('active');
  });
  
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  if (formType !== 'forgot') {
    document.querySelector(`.auth-tab[onclick*="${formType}"]`).classList.add('active');
  }
  
  const targetForm = document.getElementById(`${formType}-form`);
  if (targetForm) targetForm.classList.add('active');

  if (formType === 'reset') {
    document.getElementById('auth-tabs').style.display = 'none';
  }
}



// API Handling
async function handleRequest(url, method, body) {
  try {
    showLoading(true);
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  } finally {
    showLoading(false);
  }
}

// Form Handlers
async function loginUser(event) {
  event.preventDefault();
  const regno = document.getElementById('login-regno').value;
  const pwd = document.getElementById('login-password').value;

  try {
    const data = await handleRequest('http://localhost:3500/auth', 'POST', { regno, pwd });
    localStorage.setItem('accessToken', data.accessToken);
    window.location.href = '/e-wallet.html';
  } catch (error) {
    showError('login-password', error.message);
  }
}

async function registerUser(event) {
  event.preventDefault();
  const user = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const regno = document.getElementById('signup-regno').value;
  const pwd = document.getElementById('signup-password').value;
  const confirmPwd = document.getElementById('confirm-password').value;

  // Validation
  if (!validateEmail(email)) {
    return showError('signup-email', 'Invalid email format');
  }
  if (pwd !== confirmPwd) {
    return showError('confirm-password', 'Passwords do not match');
  }
  if (!validatePassword(pwd)) {
    return showError('signup-password', 'Minimum 8 characters required');
  }

  try {
    await handleRequest('http://localhost:3500/register', 'POST', { user, pwd, email, regno });
    switchForm('login');
    alert('Registration successful! Please login.');
  } catch (error) {
    showError('signup-username', error.message);
  }
}

// Event Listeners
document.getElementById('login-form').addEventListener('submit', loginUser);
document.getElementById('signup-form').addEventListener('submit', registerUser);

document.getElementById('signup-email').addEventListener('input', (e) => {
  showError('signup-email', validateEmail(e.target.value) ? '' : 'Invalid email format');
});

document.getElementById('signup-password').addEventListener('input', (e) => {
  showError('signup-password', validatePassword(e.target.value) ? '' : 'Minimum 8 characters required');
});

document.getElementById('confirm-password').addEventListener('input', (e) => {
  const pwd = document.getElementById('signup-password').value;
  showError('confirm-password', e.target.value === pwd ? '' : 'Passwords do not match');
});