const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/api/dashboard.controller');

router.get('/', ctrl.overview);
router.get('/summary', ctrl.summary);
router.get('/charts/category', ctrl.chartCategory);
router.get('/charts/trends', ctrl.chartTrends);
router.get('/charts/payment-method', ctrl.chartPaymentMethod);

module.exports = router;
