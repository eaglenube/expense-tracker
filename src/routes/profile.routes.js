const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/profile.controller');

router.get('/', ctrl.index);
router.post('/', ctrl.updateProfile);
router.post('/password', ctrl.updatePassword);

module.exports = router;
