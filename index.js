const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, 'public')));

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use(authRoutes);
app.use(adminRoutes);

// Auth middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  return res.status(403).send('Forbidden: Please login first');
}

// Admin dashboard route
app.get('/admin-dashboard.html', isAuthenticated, (req, res) => {
  if (req.session.user.role === 'admin') {
    res.sendFile(path.join(__dirname, 'views', 'admin-dashboard.html'));
  } else {
    res.status(403).send('Access denied: Admins only');
  }
});

// User dashboard
app.get('/dashboard.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// 404
app.use((req, res) => {
  res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
