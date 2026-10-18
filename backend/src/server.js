const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const planRoutes = require('./routes/planRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const billingRoutes = require('./routes/billingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const dietRoutes = require('./routes/dietRoutes');
const progressRoutes = require('./routes/progressRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const eventRoutes = require('./routes/eventRoutes');
const postRoutes = require('./routes/postRoutes');
const gymStatusRoutes = require('./routes/gymStatusRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'RV FITNESS GYM MANAGEMENT SYSTEM',
    location: 'Narsobawadi',
    timestamp: new Date().toISOString()
  });
});

// Mount modular REST APIs
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes); // Route aliases (/api/forgot-password, /api/reset-password, etc.)
app.use('/api/members', memberRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/membership-plans', planRoutes);
app.use('/api/plans', planRoutes); // Route alias
app.use('/api/memberships', membershipRoutes);
app.use('/api/invoices', billingRoutes);
app.use('/api', paymentRoutes); // /api/payments, /api/receipts
app.use('/api/workouts', workoutRoutes);
app.use('/api/diets', dietRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/gym-status', gymStatusRoutes);
app.use('/api', reportRoutes); // /api/dashboard/*, /api/reports, /api/audit-logs

// Central error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`  RV FITNESS – GYM MANAGEMENT SYSTEM (Narsobawadi)`);
    console.log(`  Server running successfully on http://localhost:${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
