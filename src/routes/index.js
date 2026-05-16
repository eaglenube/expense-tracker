const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const categoryRoutes = require('./category.routes');
const paymentMethodRoutes = require('./payment-method.routes');
const expenseRoutes = require('./expense.routes');
const incomeRoutes = require('./income.routes');
const reportRoutes = require('./report.routes');
const settingsRoutes = require('./settings.routes');
const profileRoutes = require('./profile.routes');

const { requireAuth } = require('../middleware/auth');

router.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.redirect('/login');
});

router.use('/', authRoutes);
router.use('/dashboard', requireAuth, dashboardRoutes);
router.use('/categories', requireAuth, categoryRoutes);
router.use('/payment-methods', requireAuth, paymentMethodRoutes);
router.use('/expenses', requireAuth, expenseRoutes);
router.use('/incomes', requireAuth, incomeRoutes);
router.use('/reports', requireAuth, reportRoutes);
router.use('/settings', requireAuth, settingsRoutes);
router.use('/profile', requireAuth, profileRoutes);

module.exports = router;
