const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/settings.controller');

router.get('/', ctrl.index);
router.post('/', ctrl.update);

module.exports = router;
