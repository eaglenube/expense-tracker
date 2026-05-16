const express = require('express');
const router = express.Router();

const { apiAuth, apiNotFound, apiErrorHandler } = require('../../middleware/api-auth');

const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');
const paymentMethodRoutes = require('./payment-method.routes');
const expenseRoutes = require('./expense.routes');
const incomeRoutes = require('./income.routes');
const dashboardRoutes = require('./dashboard.routes');
const reportRoutes = require('./report.routes');
const settingsRoutes = require('./settings.routes');
const profileRoutes = require('./profile.routes');

router.get('/health', (req, res) =>
  res.json({ ok: true, data: { service: 'expense-tracker-api', version: 'v1', time: new Date().toISOString() } })
);

router.use('/auth', authRoutes);

router.use('/categories', apiAuth, categoryRoutes);
router.use('/payment-methods', apiAuth, paymentMethodRoutes);
router.use('/expenses', apiAuth, expenseRoutes);
router.use('/incomes', apiAuth, incomeRoutes);
router.use('/dashboard', apiAuth, dashboardRoutes);
router.use('/reports', apiAuth, reportRoutes);
router.use('/settings', apiAuth, settingsRoutes);
router.use('/profile', apiAuth, profileRoutes);

router.use(apiNotFound);
router.use(apiErrorHandler);

module.exports = router;
