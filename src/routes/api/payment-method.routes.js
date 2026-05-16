const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/api/payment-method.controller');
const { rules } = require('../../validators/payment-method.validator');
const { apiValidate } = require('../../middleware/api-auth');

router.get('/', ctrl.list);
router.get('/dropdown', ctrl.dropdown);
router.get('/:id', ctrl.show);
router.post('/', rules, apiValidate, ctrl.create);
router.put('/:id', rules, apiValidate, ctrl.update);
router.post('/:id/toggle', ctrl.toggle);
router.delete('/:id', ctrl.destroy);

module.exports = router;
