const { body } = require('express-validator');

const VALID_TYPES = ['Bank Account', 'Debit Card', 'Credit Card', 'Cash', 'Wallet', 'UPI', 'Other'];

const rules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('type').isIn(VALID_TYPES).withMessage('Invalid payment method type'),
  body('opening_balance').optional({ checkFalsy: true }).isFloat().withMessage('Opening balance must be numeric'),
];

module.exports = { rules, VALID_TYPES };
