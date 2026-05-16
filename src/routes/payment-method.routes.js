const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/payment-method.controller');
const { rules } = require('../validators/payment-method.validator');
const { handleValidation } = require('../middleware/validate');

router.get('/', ctrl.index);
router.post('/', rules, handleValidation(), ctrl.create);
router.put('/:id', rules, handleValidation(), ctrl.update);
router.post('/:id/toggle', ctrl.toggle);
router.delete('/:id', ctrl.destroy);

module.exports = router;
