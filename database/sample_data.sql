-- ============================================================
-- Employee Management System - Sample Data
-- Run AFTER employee_management.sql
-- ============================================================

USE employee_management;

-- NOTE: No admin account is seeded here on purpose. Passwords must be
-- hashed with bcrypt at registration time, so create your first admin
-- using the POST /api/auth/register endpoint (see README.md) instead
-- of inserting a row manually.

-- Sample employees
INSERT INTO employees
  (employee_id, full_name, email, phone, department, position, salary, gender, joining_date, address, profile_image)
VALUES
('EMP1001', 'Rahul Sharma', 'rahul.sharma@example.com', '9876543210', 'Engineering', 'Software Engineer', 65000.00, 'Male', '2022-01-15', 'Mumbai, Maharashtra', NULL),
('EMP1002', 'Priya Verma', 'priya.verma@example.com', '9876543211', 'Human Resources', 'HR Manager', 72000.00, 'Female', '2021-06-01', 'Pune, Maharashtra', NULL),
('EMP1003', 'Amit Patel', 'amit.patel@example.com', '9876543212', 'Sales', 'Sales Executive', 48000.00, 'Male', '2023-03-10', 'Ahmedabad, Gujarat', NULL),
('EMP1004', 'Sneha Iyer', 'sneha.iyer@example.com', '9876543213', 'Finance', 'Financial Analyst', 58000.00, 'Female', '2022-11-20', 'Chennai, Tamil Nadu', NULL),
('EMP1005', 'Vikram Singh', 'vikram.singh@example.com', '9876543214', 'Engineering', 'Senior Developer', 95000.00, 'Male', '2020-08-05', 'Delhi', NULL),
('EMP1006', 'Anjali Nair', 'anjali.nair@example.com', '9876543215', 'Marketing', 'Marketing Lead', 68000.00, 'Female', '2021-02-17', 'Kochi, Kerala', NULL),
('EMP1007', 'Karan Mehta', 'karan.mehta@example.com', '9876543216', 'Engineering', 'QA Engineer', 52000.00, 'Male', '2023-07-01', 'Bengaluru, Karnataka', NULL),
('EMP1008', 'Divya Reddy', 'divya.reddy@example.com', '9876543217', 'Human Resources', 'HR Executive', 44000.00, 'Female', '2023-01-25', 'Hyderabad, Telangana', NULL);
