const express = require('express');
const router = express.Router();

const { requireGuest, requireAuth } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validate');
const { registerRules, loginRules } = require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');

router.get('/login', requireGuest, authController.showLogin);
router.get('/register', requireGuest, authController.showRegister);

router.post('/register', requireGuest, registerRules, handleValidation(), authController.register);
router.post('/login', requireGuest, loginRules, handleValidation(), authController.login);

router.post('/logout', requireAuth, authController.logout);

module.exports = router;
