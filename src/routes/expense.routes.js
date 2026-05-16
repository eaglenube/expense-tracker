const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/expense.controller');
const { rules } = require('../validators/expense.validator');
const { handleValidation } = require('../middleware/validate');
const { expenseUpload } = require('../middleware/upload');

router.get('/', ctrl.index);
router.post('/', expenseUpload.single('attachment'), rules, handleValidation(), ctrl.create);
router.put('/:id', expenseUpload.single('attachment'), rules, handleValidation(), ctrl.update);
router.delete('/:id', ctrl.destroy);

module.exports = router;
