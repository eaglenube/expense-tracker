const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/category.controller');
const { rules } = require('../validators/category.validator');
const { handleValidation } = require('../middleware/validate');

router.get('/', ctrl.index);
router.post('/', rules, handleValidation(), ctrl.create);
router.put('/:id', rules, handleValidation(), ctrl.update);
router.delete('/:id', ctrl.destroy);

module.exports = router;
