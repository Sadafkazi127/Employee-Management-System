// ============================================================
// Shared UI utilities — toast notifications, confirm modal,
// loading spinner, and small helper functions
// ============================================================

/** Toast notifications */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end';
    document.body.appendChild(container);
  }

  const colors = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-amber-500'
  };

  const toast = document.createElement('div');
  toast.className = `${colors[type] || colors.info} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[240px] max-w-sm animate-[fadeIn_.2s_ease-out] text-sm font-medium`;
  toast.innerHTML = `<span class="flex-1">${message}</span>
    <button class="text-white/80 hover:text-white text-lg leading-none" aria-label="Dismiss">&times;</button>`;

  toast.querySelector('button').addEventListener('click', () => toast.remove());
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition', 'duration-300');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/** Full-page / inline loading spinner */
function showSpinner() {
  let el = document.getElementById('global-spinner');
  if (!el) {
    el = document.createElement('div');
    el.id = 'global-spinner';
    el.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] flex items-center justify-center';
    el.innerHTML = `<div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>`;
    document.body.appendChild(el);
  }
  el.classList.remove('hidden');
}

function hideSpinner() {
  const el = document.getElementById('global-spinner');
  if (el) el.classList.add('hidden');
}

/** Confirmation modal — returns a Promise<boolean> */
function confirmModal({ title = 'Are you sure?', message = '', confirmText = 'Confirm', danger = true } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/40 z-[9997] flex items-center justify-center p-4';
    overlay.innerHTML = `
      <div class="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-[fadeIn_.15s_ease-out]">
        <h3 class="text-lg font-semibold text-slate-800 mb-2">${title}</h3>
        <p class="text-sm text-slate-500 mb-6">${message}</p>
        <div class="flex justify-end gap-3">
          <button id="modal-cancel" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition">Cancel</button>
          <button id="modal-confirm" class="px-4 py-2 rounded-lg text-sm font-medium text-white ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} transition">${confirmText}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    overlay.querySelector('#modal-cancel').addEventListener('click', () => {
      overlay.remove();
      resolve(false);
    });
    overlay.querySelector('#modal-confirm').addEventListener('click', () => {
      overlay.remove();
      resolve(true);
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) { overlay.remove(); resolve(false); }
    });
  });
}

/** Format a number as currency */
function formatCurrency(value) {
  const n = Number(value);
  if (isNaN(n)) return value;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

/** Format an ISO date string as e.g. "12 Jan 2024" */
function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Get initials from a full name for avatar placeholders */
function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

/** Debounce helper for instant search inputs */
function debounce(fn, delay = 350) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
