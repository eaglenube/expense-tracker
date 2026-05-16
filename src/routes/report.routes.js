const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/report.controller');

router.get('/', ctrl.index);
router.get('/export.csv', ctrl.exportCsv);

module.exports = router;
