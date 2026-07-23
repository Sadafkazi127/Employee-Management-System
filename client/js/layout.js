// ============================================================
// Injects the shared sidebar + topbar into any page that has
// <div id="sidebar-root"></div> and <div id="topbar-root"></div>
// ============================================================

function renderLayout(activePage) {
  const admin = getCurrentAdmin();

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { key: 'employees', label: 'Employees', href: 'employees.html', icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 3.13a4 4 0 00-1-7.87' },
    { key: 'add-employee', label: 'Add Employee', href: 'add-employee.html', icon: 'M12 4v16m8-8H4' },
    { key: 'profile', label: 'Profile', href: 'profile.html', icon: 'M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.12 17.804zM15 10a3 3 0 11-6 0 3 3 0 016 0z' }
  ];

  const sidebarRoot = document.getElementById('sidebar-root');
  if (sidebarRoot) {
    sidebarRoot.innerHTML = `
    <aside id="app-sidebar" class="fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-700 to-blue-800 text-white flex flex-col transform -translate-x-full lg:translate-x-0 transition-transform duration-200">
      <div class="h-16 flex items-center gap-2 px-6 border-b border-white/10">
        <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8z"/></svg>
        <span class="font-bold text-lg tracking-tight">EMS</span>
      </div>
      <nav class="flex-1 px-3 py-6 space-y-1">
        ${navItems.map(item => `
          <a href="${item.href}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activePage === item.key ? 'bg-white/15 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'}">
            <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"/></svg>
            <span>${item.label}</span>
          </a>
        `).join('')}
      </nav>
      <div class="px-3 pb-6">
        <button id="sidebar-logout-btn" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white transition">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
    <div id="sidebar-backdrop" class="fixed inset-0 bg-black/40 z-30 hidden lg:hidden"></div>`;
  }

  const topbarRoot = document.getElementById('topbar-root');
  if (topbarRoot) {
    topbarRoot.innerHTML = `
    <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div class="flex items-center gap-3">
        <button id="sidebar-toggle-btn" class="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <h1 class="text-lg sm:text-xl font-semibold text-slate-800 capitalize">${activePage.replace('-', ' ')}</h1>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
          ${admin ? getInitials(admin.name) : 'A'}
        </div>
        <div class="hidden sm:block text-sm">
          <p class="font-medium text-slate-700 leading-tight">${admin ? admin.name : 'Admin'}</p>
          <p class="text-slate-400 text-xs leading-tight">${admin ? admin.email : ''}</p>
        </div>
      </div>
    </header>`;
  }

  // Wire up interactions after injection
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  const openSidebar = () => {
    sidebar.classList.remove('-translate-x-full');
    backdrop.classList.remove('hidden');
  };
  const closeSidebar = () => {
    sidebar.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
  };

  if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  const logoutBtn = document.getElementById('sidebar-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const ok = await confirmModal({
        title: 'Log out?',
        message: 'You will need to log in again to access the dashboard.',
        confirmText: 'Logout',
        danger: false
      });
      if (ok) {
        clearSession();
        showToast('Logged out successfully.', 'success');
        setTimeout(() => window.location.href = 'login.html', 500);
      }
    });
  }
}
