const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/api/profile.controller');

router.get('/', ctrl.get);
router.put('/', ctrl.update);
router.put('/password', ctrl.updatePassword);

module.exports = router;
