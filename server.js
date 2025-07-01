const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Route middleware
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use(authRoutes);
app.use(adminRoutes);

// Session check middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  return res.status(403).send('Forbidden: Please login first');
}

// Serve dashboard.html from /views
app.get('/dashboard.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Serve admin-dashboard.html from /views
app.get('/admin-dashboard.html', isAuthenticated, (req, res) => {
  if (req.session.user?.role === 'admin') {
    res.sendFile(path.join(__dirname, 'views', 'admin-dashboard.html'));
  } else {
    res.status(403).send('Forbidden: Admins only');
  }
});

// Default index route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Fallback 404
app.use((req, res) => {
  res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
