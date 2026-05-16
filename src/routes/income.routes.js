const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/income.controller');
const { rules } = require('../validators/income.validator');
const { handleValidation } = require('../middleware/validate');
const { incomeUpload } = require('../middleware/upload');

router.get('/', ctrl.index);
router.post('/', incomeUpload.single('attachment'), rules, handleValidation(), ctrl.create);
router.put('/:id', incomeUpload.single('attachment'), rules, handleValidation(), ctrl.update);
router.delete('/:id', ctrl.destroy);

module.exports = router;
