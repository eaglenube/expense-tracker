const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/api/category.controller');
const { rules } = require('../../validators/category.validator');
const { apiValidate } = require('../../middleware/api-auth');

router.get('/', ctrl.list);
router.get('/dropdown', ctrl.dropdown);
router.get('/:id', ctrl.show);
router.post('/', rules, apiValidate, ctrl.create);
router.put('/:id', rules, apiValidate, ctrl.update);
router.delete('/:id', ctrl.destroy);

module.exports = router;
