// ============================================================
// Shared logic for add-employee.html and edit-employee.html
// Mode is detected via the ?id= query parameter
// ============================================================
requireAuth();

const urlParams = new URLSearchParams(window.location.search);
const employeeId = urlParams.get('id');
const isEditMode = Boolean(employeeId);

renderLayout(isEditMode ? 'employees' : 'add-employee');

const PHONE_REGEX = /^[0-9]{10}$/;
const EMAIL_REGEX_FORM = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const form = document.getElementById('employee-form');
const submitBtn = document.getElementById('submit-btn');
const imageInput = document.getElementById('profile_image');
const imagePreview = document.getElementById('image-preview');

const fields = {
  full_name: document.getElementById('full_name'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  gender: document.getElementById('gender'),
  department: document.getElementById('department'),
  position: document.getElementById('position'),
  salary: document.getElementById('salary'),
  joining_date: document.getElementById('joining_date'),
  address: document.getElementById('address')
};

let existingImagePath = null;

function setError(input, message) {
  const errorEl = input.parentElement.querySelector('.error-text') || input.closest('div').querySelector('.error-text');
  if (!errorEl) return;
  if (message) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    input.classList.add('border-red-400');
  } else {
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
    input.classList.remove('border-red-400');
  }
}

// Live preview for uploaded image
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    showToast('Image must be smaller than 2MB.', 'error');
    imageInput.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover" alt="Preview" />`;
  };
  reader.readAsDataURL(file);
});

// Restrict phone input to digits only
fields.phone.addEventListener('input', () => {
  fields.phone.value = fields.phone.value.replace(/\D/g, '').slice(0, 10);
});

function validateForm() {
  let valid = true;

  if (!fields.full_name.value.trim()) {
    setError(fields.full_name, 'Full name is required.');
    valid = false;
  } else setError(fields.full_name, '');

  if (!EMAIL_REGEX_FORM.test(fields.email.value.trim())) {
    setError(fields.email, 'Please enter a valid email address.');
    valid = false;
  } else setError(fields.email, '');

  if (!PHONE_REGEX.test(fields.phone.value.trim())) {
    setError(fields.phone, 'Phone number must be exactly 10 digits.');
    valid = false;
  } else setError(fields.phone, '');

  if (!fields.gender.value) {
    setError(fields.gender, 'Please select a gender.');
    valid = false;
  } else setError(fields.gender, '');

  if (!fields.department.value.trim()) {
    setError(fields.department, 'Department is required.');
    valid = false;
  } else setError(fields.department, '');

  if (!fields.position.value.trim()) {
    setError(fields.position, 'Position is required.');
    valid = false;
  } else setError(fields.position, '');

  const salaryVal = Number(fields.salary.value);
  if (fields.salary.value === '' || isNaN(salaryVal) || salaryVal < 0) {
    setError(fields.salary, 'Salary must be a valid positive number.');
    valid = false;
  } else setError(fields.salary, '');

  if (!fields.joining_date.value) {
    setError(fields.joining_date, 'Date of joining is required.');
    valid = false;
  } else setError(fields.joining_date, '');

  return valid;
}

async function loadEmployeeForEdit() {
  showSpinner();
  try {
    const res = await apiRequest(`/employees/${employeeId}`);
    const emp = res.data.employee;

    fields.full_name.value = emp.full_name;
    fields.email.value = emp.email;
    fields.phone.value = emp.phone;
    fields.gender.value = emp.gender;
    fields.department.value = emp.department;
    fields.position.value = emp.position;
    fields.salary.value = emp.salary;
    fields.joining_date.value = emp.joining_date;
    fields.address.value = emp.address || '';
    existingImagePath = emp.profile_image;

    if (emp.profile_image) {
      imagePreview.innerHTML = `<img src="${emp.profile_image}" class="w-full h-full object-cover" alt="${emp.full_name}" />`;
    }

    submitBtn.textContent = 'Update Employee';
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    hideSpinner();
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const formData = new FormData();
  formData.append('full_name', fields.full_name.value.trim());
  formData.append('email', fields.email.value.trim());
  formData.append('phone', fields.phone.value.trim());
  formData.append('gender', fields.gender.value);
  formData.append('department', fields.department.value.trim());
  formData.append('position', fields.position.value.trim());
  formData.append('salary', fields.salary.value);
  formData.append('joining_date', fields.joining_date.value);
  formData.append('address', fields.address.value.trim());
  if (imageInput.files[0]) {
    formData.append('profile_image', imageInput.files[0]);
  }

  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = isEditMode ? 'Updating...' : 'Saving...';

  try {
    if (isEditMode) {
      await apiRequest(`/employees/${employeeId}`, { method: 'PUT', body: formData, isFormData: true });
      showToast('Employee updated successfully.', 'success');
    } else {
      await apiRequest('/employees', { method: 'POST', body: formData, isFormData: true });
      showToast('Employee added successfully.', 'success');
    }
    setTimeout(() => window.location.href = 'employees.html', 600);
  } catch (err) {
    showToast(err.message, 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

if (isEditMode) {
  loadEmployeeForEdit();
}
