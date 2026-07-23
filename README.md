# Employee Management System

A complete full-stack **Employee Management System** with secure admin authentication, a live dashboard, and full employee CRUD — built with vanilla HTML/Tailwind CSS/JavaScript on the frontend and Node.js/Express/MySQL on the backend.

---

## ✨ Features

- **Secure Admin Authentication**
  - Admin registration & login
  - Passwords hashed with `bcrypt`
  - JWT-based sessions with a token verification middleware
  - Protected routes — the dashboard and API are inaccessible without a valid token
- **Admin Dashboard**
  - Total employees, male/female counts, department count
  - Recently added employees list
  - Responsive stat cards
- **Employee Management (CRUD)**
  - Create, view, update, and delete employees
  - Auto-generated Employee IDs (`EMP1001`, `EMP1002`, ...)
  - Optional profile image upload
  - Full field validation on both the client and the server
- **Search, Sort & Pagination**
  - Instant search by name, email, department, or position
  - Sortable by name, salary, department, and date
  - Paginated results table
- **Modern UI**
  - Blue & white color scheme built with Tailwind CSS
  - Gradient login/register screens
  - Sidebar navigation + responsive top bar
  - Toast notifications, confirmation modals, loading spinners, skeleton loaders
  - Fully mobile responsive

---

## 🛠 Technologies Used

| Layer          | Technology                              |
|----------------|------------------------------------------|
| Frontend       | HTML5, Tailwind CSS (CDN), Vanilla JS (ES6) |
| Backend        | Node.js, Express.js                     |
| Database       | MySQL (via `mysql2/promise`)            |
| Authentication | JWT (`jsonwebtoken`), `bcrypt`           |
| File Uploads   | `multer`                                |

No frontend frameworks (React/Vue) and no Bootstrap are used, per project requirements.

---

## 📁 Folder Structure

```
employee-management-system/
├── client/                  # Static frontend
│   ├── index.html            # Auth-state redirect
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── employees.html
│   ├── add-employee.html
│   ├── edit-employee.html
│   ├── profile.html
│   ├── css/style.css
│   ├── js/                   # config, api, utils, layout, auth, dashboard, employees, employee-form, profile
│   ├── assets/
│   └── images/
│
├── server/                  # Express API
│   ├── config/                # db.js (MySQL pool), upload.js (multer)
│   ├── controllers/           # authController.js, employeeController.js
│   ├── middleware/             # authMiddleware, validateMiddleware, errorMiddleware
│   ├── models/                 # adminModel.js, employeeModel.js
│   ├── routes/                 # authRoutes.js, employeeRoutes.js
│   ├── uploads/                # uploaded profile images (gitignored)
│   ├── app.js
│   └── package.json
│
├── database/
│   ├── employee_management.sql   # schema
│   └── sample_data.sql           # sample employees
│
├── docs/screenshots/          # add your own screenshots here
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- [MySQL](https://dev.mysql.com/downloads/) 8.x (or compatible)

### 2. Clone / extract the project
```bash
cd employee-management-system
```

### 3. Install server dependencies
```bash
cd server
npm install
```

### 4. Configure environment variables
Copy the example file and fill in your own values:
```bash
cp ../.env.example .env
```
Then edit `server/.env`:
```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employee_management

JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=1d

CLIENT_ORIGIN=http://localhost:5500
```

> ⚠️ Always use a long, random `JWT_SECRET` in real deployments — never commit `.env` to version control.

### 5. Set up the database
Log into MySQL and run the provided SQL scripts in order:
```bash
mysql -u root -p < ../database/employee_management.sql
mysql -u root -p < ../database/sample_data.sql
```
This creates the `employee_management` database, the `admins` and `employees` tables, and seeds a handful of sample employees. **No admin account is pre-seeded** — register your first admin from the app itself (see below) so the password is hashed correctly with bcrypt.

### 6. Run the project
```bash
npm start
# or, for auto-reload during development:
npm run dev
```
The server starts on `http://localhost:5000` and also serves the `client/` folder directly, so you can open:
```
http://localhost:5000
```
in your browser to use the full app from a single server.

Alternatively, you can serve `client/` separately (e.g. with the VS Code "Live Server" extension on port 5500) — just make sure `CLIENT_ORIGIN` in `.env` matches that origin for CORS.

### 7. Create your admin account
Open the app, click **Register**, and create your first admin login. You'll be redirected straight to the dashboard.

---

## 🔌 API Reference

All `employees` routes require an `Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint             | Description              |
|--------|-----------------------|--------------------------|
| POST   | `/api/auth/register`  | Register a new admin     |
| POST   | `/api/auth/login`     | Log in and receive a JWT |
| GET    | `/api/auth/me`        | Get the current admin's profile (protected) |

### Employees
| Method | Endpoint                        | Description                          |
|--------|----------------------------------|---------------------------------------|
| GET    | `/api/employees`                 | List employees (search, sort, paginate via query params) |
| GET    | `/api/employees/search?q=`       | Search employees                      |
| GET    | `/api/employees/dashboard/stats` | Dashboard statistics                  |
| GET    | `/api/employees/:id`             | Get one employee                      |
| POST   | `/api/employees`                 | Create an employee (multipart/form-data for image upload) |
| PUT    | `/api/employees/:id`             | Update an employee                    |
| DELETE | `/api/employees/:id`             | Delete an employee                    |

Query params supported on `GET /api/employees`: `search`, `page`, `limit`, `sortBy` (`full_name`, `email`, `department`, `position`, `salary`, `joining_date`, `created_at`), `sortOrder` (`ASC`/`DESC`).

---

## ✅ Validation Rules

Enforced on both the client (instant feedback) and the server (source of truth):

- No required field may be empty
- Email must be a valid format and unique per employee
- Phone number must be exactly 10 digits
- Salary must be a positive number
- Gender must be `Male`, `Female`, or `Other`
- Date of joining must be a valid date
- Profile images limited to JPG/PNG/WEBP, 2MB max

---

## 📸 Screenshots

Add your own screenshots to `docs/screenshots/` and reference them here, e.g.:

```markdown
![Login Page](docs/screenshots/login.png)
![Dashboard](docs/screenshots/dashboard.png)
![Employees List](docs/screenshots/employees.png)
```

---

## 🔒 Security Notes

- Passwords are never stored in plain text (bcrypt, 10 salt rounds)
- All employee routes are protected by JWT verification middleware
- SQL is parameterized throughout (no string-concatenated queries)
- Sortable columns are whitelisted server-side to prevent SQL injection via query params
- Uploaded files are validated for type and size before being written to disk

---

## 📄 License

This project is provided as-is for portfolio and educational use.
