const { body } = require('express-validator');

const rules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('color').optional({ checkFalsy: true }).isHexColor().withMessage('Color must be a hex code'),
];

module.exports = { rules };
