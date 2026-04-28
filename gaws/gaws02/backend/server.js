const express = require('express');
const path = require('path');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '..', 'client')));
app.use('/node_modules', express.static(path.join(__dirname, '..', 'node_modules')));

// Mock API routes for Employee Management
const mockEmployees = [
  {
    id: 'EMP001',
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '(555) 123-4567',
    dob: '1985-05-15',
    gender: 'male',
    department: 'IT',
    position: 'Senior Developer',
    startDate: '2020-01-15',
    salary: 95000,
    bonus: 15,
    currency: 'USD',
    payFrequency: 'monthly',
    status: 'active',
    remote: true
  },
  {
    id: 'EMP002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '(555) 234-5678',
    dob: '1990-08-22',
    gender: 'female',
    department: 'HR',
    position: 'HR Manager',
    startDate: '2019-03-10',
    salary: 75000,
    bonus: 10,
    currency: 'USD',
    payFrequency: 'monthly',
    status: 'active',
    remote: false
  }
];

const mockDepartments = [
  { id: 'IT', name: 'Information Technology', head: 'John Smith', employeeCount: 15, budget: 500000 },
  { id: 'HR', name: 'Human Resources', head: 'Sarah Johnson', employeeCount: 8, budget: 200000 },
  { id: 'FIN', name: 'Finance', head: 'Robert Brown', employeeCount: 10, budget: 300000 }
];

// API Endpoints
app.get('/api/employees', (req, res) => {
  res.json(mockEmployees);
});

app.post('/api/employees', (req, res) => {
  const newEmployee = { ...req.body, id: 'EMP' + Date.now() };
  mockEmployees.push(newEmployee);
  res.status(201).json(newEmployee);
});

app.put('/api/employees/:id', (req, res) => {
  const index = mockEmployees.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    mockEmployees[index] = { ...mockEmployees[index], ...req.body };
    res.json(mockEmployees[index]);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.delete('/api/employees/:id', (req, res) => {
  const index = mockEmployees.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    mockEmployees.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.get('/api/departments', (req, res) => {
  res.json(mockDepartments);
});

app.post('/api/departments', (req, res) => {
  const newDept = { ...req.body, id: req.body.name.substring(0, 3).toUpperCase() };
  mockDepartments.push(newDept);
  res.status(201).json(newDept);
});

app.delete('/api/departments/:id', (req, res) => {
  const index = mockDepartments.findIndex(d => d.id === req.params.id);
  if (index !== -1) {
    mockDepartments.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Department not found' });
  }
});

app.get('/api/payroll', (req, res) => {
  const payrollData = mockEmployees.map(emp => ({
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    baseSalary: emp.salary,
    bonus: emp.salary * (emp.bonus / 100),
    deductions: emp.salary * 0.15,
    netPay: emp.salary + (emp.salary * (emp.bonus / 100)) - (emp.salary * 0.15),
    status: 'pending'
  }));
  res.json(payrollData);
});

app.get('/api/reviews', (req, res) => {
  const mockReviews = [
    {
      id: 'REV001',
      employeeId: 'EMP001',
      employeeName: 'John Smith',
      period: 'Q1 2024',
      rating: 4,
      date: '2024-03-15',
      comments: 'Excellent performance, great leadership',
      strengths: 'Technical expertise, mentoring skills',
      improvements: 'Work-life balance',
      status: 'completed'
    }
  ];
  res.json(mockReviews);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// SPA fallback - must be last route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ AngularJS Application running!`);
  console.log(`📍 Access at: http://localhost:${PORT}`);
  console.log(`🎯 Employee Management: http://localhost:${PORT}/#/employee-management`);
  console.log(`\n🛑 To stop: Ctrl+C\n`);
});
