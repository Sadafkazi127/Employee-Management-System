// ============================================================
// Employees list page logic
// ============================================================
requireAuth();
renderLayout('employees');

const state = {
  search: '',
  page: 1,
  limit: 10,
  sortBy: 'created_at',
  sortOrder: 'DESC'
};

const tbody = document.getElementById('employees-body');
const emptyState = document.getElementById('empty-state');
const paginationSummary = document.getElementById('pagination-summary');
const paginationControls = document.getElementById('pagination-controls');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

function renderSkeletonRows(count = 5) {
  tbody.innerHTML = Array.from({ length: count }).map(() => `
    <tr class="border-b border-slate-50">
      <td class="px-5 py-4"><div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full skeleton"></div>
        <div class="space-y-1"><div class="h-3 w-32 rounded skeleton"></div><div class="h-2.5 w-24 rounded skeleton"></div></div>
      </div></td>
      <td class="px-5 py-4"><div class="h-3 w-20 rounded skeleton"></div></td>
      <td class="px-5 py-4"><div class="h-3 w-24 rounded skeleton"></div></td>
      <td class="px-5 py-4"><div class="h-3 w-16 rounded skeleton"></div></td>
      <td class="px-5 py-4"><div class="h-3 w-16 rounded skeleton ml-auto"></div></td>
    </tr>
  `).join('');
}

function renderRows(employees) {
  if (employees.length === 0) {
    tbody.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  tbody.innerHTML = employees.map(emp => `
    <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition">
      <td class="px-5 py-3">
        <div class="flex items-center gap-3">
          ${emp.profile_image
            ? `<img src="${emp.profile_image}" class="w-9 h-9 rounded-full object-cover" alt="${emp.full_name}" />`
            : `<div class="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold shrink-0">${getInitials(emp.full_name)}</div>`}
          <div class="min-w-0">
            <p class="font-medium text-slate-800 truncate">${emp.full_name}</p>
            <p class="text-slate-400 text-xs truncate">${emp.email}</p>
          </div>
        </div>
      </td>
      <td class="px-5 py-3 text-slate-600">${emp.department}</td>
      <td class="px-5 py-3 text-slate-600">${emp.position}</td>
      <td class="px-5 py-3 text-slate-600">${formatCurrency(emp.salary)}</td>
      <td class="px-5 py-3">
        <div class="flex items-center justify-end gap-2">
          <a href="edit-employee.html?id=${emp.id}" class="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition" title="Edit">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </a>
          <button data-id="${emp.id}" data-name="${emp.full_name}" class="delete-btn p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition" title="Delete">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => handleDelete(btn.dataset.id, btn.dataset.name));
  });
}

function renderPagination({ total, page, totalPages }) {
  const start = total === 0 ? 0 : (page - 1) * state.limit + 1;
  const end = Math.min(page * state.limit, total);
  paginationSummary.textContent = `Showing ${start}–${end} of ${total} employees`;

  if (totalPages <= 1) {
    paginationControls.innerHTML = '';
    return;
  }

  let buttons = '';
  buttons += `<button data-page="${page - 1}" ${page === 1 ? 'disabled' : ''} class="page-btn px-3 py-1.5 rounded-lg text-sm border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100">Prev</button>`;

  const pages = new Set([1, totalPages, page, page - 1, page + 1].filter(p => p >= 1 && p <= totalPages));
  const sorted = [...pages].sort((a, b) => a - b);
  let prev = 0;
  sorted.forEach(p => {
    if (prev && p - prev > 1) buttons += `<span class="px-2 text-slate-400">…</span>`;
    buttons += `<button data-page="${p}" class="page-btn px-3 py-1.5 rounded-lg text-sm border ${p === page ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 hover:bg-slate-100'}">${p}</button>`;
    prev = p;
  });

  buttons += `<button data-page="${page + 1}" ${page === totalPages ? 'disabled' : ''} class="page-btn px-3 py-1.5 rounded-lg text-sm border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100">Next</button>`;

  paginationControls.innerHTML = buttons;
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = Number(btn.dataset.page);
      if (p >= 1 && p <= totalPages) {
        state.page = p;
        loadEmployees();
      }
    });
  });
}

async function loadEmployees() {
  renderSkeletonRows();
  try {
    const params = new URLSearchParams({
      search: state.search,
      page: state.page,
      limit: state.limit,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder
    });
    const res = await apiRequest(`/employees?${params.toString()}`);
    renderRows(res.data.employees);
    renderPagination(res.data);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function handleDelete(id, name) {
  const ok = await confirmModal({
    title: 'Delete employee?',
    message: `This will permanently remove ${name} from the system. This action cannot be undone.`,
    confirmText: 'Delete'
  });
  if (!ok) return;

  showSpinner();
  try {
    await apiRequest(`/employees/${id}`, { method: 'DELETE' });
    showToast('Employee deleted successfully.', 'success');
    loadEmployees();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideSpinner();
  }
}

searchInput.addEventListener('input', debounce((e) => {
  state.search = e.target.value;
  state.page = 1;
  loadEmployees();
}, 350));

sortSelect.addEventListener('change', (e) => {
  const [sortBy, sortOrder] = e.target.value.split(':');
  state.sortBy = sortBy;
  state.sortOrder = sortOrder;
  state.page = 1;
  loadEmployees();
});

loadEmployees();
