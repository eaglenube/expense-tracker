const { body } = require('express-validator');

const rules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive'),
  body('category_id').notEmpty().withMessage('Category is required'),
  body('expense_date').notEmpty().withMessage('Date is required'),
];

module.exports = { rules };
