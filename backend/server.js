const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();

// ======================
// CORS FIX
// ======================
app.use(cors({
  origin: [
    'https://arwas-world1.vercel.app',
    'https://arwas-world1-6c9hz3o35-polycarps-projects-9740bd17.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));

// ======================
// BODY PARSER
// ======================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ======================
// STATIC FILES
// ======================
const staticDir = path.join(__dirname, 'public/uploads');

app.use('/uploads', express.static(staticDir, {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

console.log('Static files being served from:', staticDir);

// ======================
// DATABASE CONNECTION
// ======================
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/arwas_world'
)
.then(() => console.log('✓ MongoDB Connected'))
.catch(err => console.error('✗ MongoDB Connection Error:', err));

// ======================
// HEALTH ROUTE
// ======================
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running ✓' });
});

// ======================
// IMPORT ROUTES
// ======================
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const mpesaRoutes = require('./routes/mpesa');
const settingsRoutes = require('./routes/settings');
const publicSettingsRoutes = require('./routes/publicSettings');

// ======================
// API ROUTES
// ======================
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/public/settings', publicSettingsRoutes);

// ======================
// ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message || 'Internal Server Error'
  });
});

// ======================
// 404 HANDLER
// ======================
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📌 API Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
