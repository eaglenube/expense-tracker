const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/api/auth.controller');
const { registerRules, loginRules } = require('../../validators/auth.validator');
const { apiAuth, apiValidate } = require('../../middleware/api-auth');

router.post('/register', registerRules, apiValidate, ctrl.register);
router.post('/login', loginRules, apiValidate, ctrl.login);
router.post('/google', ctrl.googleLogin);
router.post('/refresh', ctrl.refresh);
router.get('/me', apiAuth, ctrl.me);
router.post('/logout', apiAuth, ctrl.logout);

module.exports = router;
