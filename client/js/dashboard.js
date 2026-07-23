// ============================================================
// Dashboard page logic
// ============================================================
requireAuth();
renderLayout('dashboard');

async function loadDashboard() {
  showSpinner();
  try {
    const res = await apiRequest('/employees/dashboard/stats');
    const stats = res.data;

    document.getElementById('stat-total').textContent = stats.totalEmployees;
    document.getElementById('stat-male').textContent = stats.maleEmployees;
    document.getElementById('stat-female').textContent = stats.femaleEmployees;
    document.getElementById('stat-departments').textContent = stats.departmentsCount;

    const tbody = document.getElementById('recent-employees-body');
    if (stats.recentEmployees.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="px-5 py-8 text-center text-slate-400">No employees added yet.</td></tr>`;
    } else {
      tbody.innerHTML = stats.recentEmployees.map(emp => `
        <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition">
          <td class="px-5 py-3">
            <div class="flex items-center gap-3">
              ${emp.profile_image
                ? `<img src="${emp.profile_image}" class="w-9 h-9 rounded-full object-cover" alt="${emp.full_name}" />`
                : `<div class="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">${getInitials(emp.full_name)}</div>`}
              <div>
                <p class="font-medium text-slate-800">${emp.full_name}</p>
                <p class="text-slate-400 text-xs">${emp.email}</p>
              </div>
            </div>
          </td>
          <td class="px-5 py-3 text-slate-600">${emp.department}</td>
          <td class="px-5 py-3 text-slate-600">${emp.position}</td>
          <td class="px-5 py-3 text-slate-500">${formatDate(emp.created_at)}</td>
        </tr>
      `).join('');
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideSpinner();
  }
}

loadDashboard();
