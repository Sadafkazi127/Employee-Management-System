// ============================================================
// Small fetch wrapper — attaches JWT, handles JSON + errors
// ============================================================

function getToken() {
  return localStorage.getItem('ems_token');
}

function setSession(token, admin) {
  localStorage.setItem('ems_token', token);
  localStorage.setItem('ems_admin', JSON.stringify(admin));
}

function clearSession() {
  localStorage.removeItem('ems_token');
  localStorage.removeItem('ems_admin');
}

function getCurrentAdmin() {
  try {
    return JSON.parse(localStorage.getItem('ems_admin') || 'null');
  } catch {
    return null;
  }
}

/**
 * apiRequest(path, { method, body, isFormData })
 * body: plain object (JSON) or FormData (for file uploads)
 */
async function apiRequest(pathname, { method = 'GET', body = null, isFormData = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData && body) headers['Content-Type'] = 'application/json';

  const options = { method, headers };
  if (body) options.body = isFormData ? body : JSON.stringify(body);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${pathname}`, options);
  } catch (networkErr) {
    throw new Error('Unable to reach the server. Please check your connection or try again later.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (response.status === 401) {
    clearSession();
    if (!window.location.pathname.includes('login.html')) {
      window.location.href = 'login.html';
    }
    throw new Error(data.message || 'Session expired. Please log in again.');
  }

  if (!response.ok) {
    const message = data.errors?.length ? data.errors.join(' ') : (data.message || 'Something went wrong.');
    throw new Error(message);
  }

  return data;
}

/** Redirects to login if there's no token — call at the top of protected pages */
function requireAuth() {
  if (!getToken()) {
    window.location.href = 'login.html';
  }
}
