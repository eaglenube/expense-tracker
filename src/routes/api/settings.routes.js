const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/api/settings.controller');

router.get('/', ctrl.get);
router.put('/', ctrl.update);

module.exports = router;
