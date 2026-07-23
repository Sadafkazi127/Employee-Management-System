// ============================================================
// Profile page logic
// ============================================================
requireAuth();
renderLayout('profile');

async function loadProfile() {
  showSpinner();
  try {
    const res = await apiRequest('/auth/me');
    const admin = res.data.admin;

    document.getElementById('profile-avatar').textContent = getInitials(admin.name);
    document.getElementById('profile-name').textContent = admin.name;
    document.getElementById('profile-email').textContent = admin.email;
    document.getElementById('profile-id').textContent = `#${admin.id}`;
    document.getElementById('profile-created').textContent = formatDate(admin.created_at);
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideSpinner();
  }
}

loadProfile();
