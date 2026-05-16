const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/api/report.controller');

router.get('/', ctrl.summary);
router.get('/export.csv', ctrl.exportCsv);

module.exports = router;
