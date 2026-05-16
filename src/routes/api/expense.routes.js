const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/api/expense.controller');
const { rules } = require('../../validators/expense.validator');
const { apiValidate } = require('../../middleware/api-auth');
const { expenseUpload } = require('../../middleware/upload');

router.get('/', ctrl.list);
router.get('/:id', ctrl.show);
router.post('/', expenseUpload.single('attachment'), rules, apiValidate, ctrl.create);
router.put('/:id', expenseUpload.single('attachment'), rules, apiValidate, ctrl.update);
router.delete('/:id', ctrl.destroy);

module.exports = router;
