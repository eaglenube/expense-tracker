const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/api/income.controller');
const { rules } = require('../../validators/income.validator');
const { apiValidate } = require('../../middleware/api-auth');
const { incomeUpload } = require('../../middleware/upload');

router.get('/', ctrl.list);
router.get('/:id', ctrl.show);
router.post('/', incomeUpload.single('attachment'), rules, apiValidate, ctrl.create);
router.put('/:id', incomeUpload.single('attachment'), rules, apiValidate, ctrl.update);
router.delete('/:id', ctrl.destroy);

module.exports = router;
