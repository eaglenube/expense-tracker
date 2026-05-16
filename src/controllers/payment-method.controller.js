const service = require('../services/payment-method.service');
const { VALID_TYPES } = require('../validators/payment-method.validator');
const { buildPagination, paginate } = require('../utils/pagination');

const index = async (req, res, next) => {
  try {
    const { page, limit } = buildPagination({ page: req.query.page, limit: 10 });
    const { rows, count } = await service.list(req.session.user.id, {
      search: req.query.search,
      type: req.query.type,
      is_active: req.query.is_active,
      page,
      limit,
    });
    res.render('payment-methods/index', {
      title: 'Payment Methods',
      items: rows,
      pagination: paginate(count, page, limit),
      filters: req.query,
      types: VALID_TYPES,
      editing: req.query.edit ? await service.findById(req.query.edit, req.session.user.id) : null,
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    await service.create(req.session.user.id, req.body);
    req.flash('success', 'Payment method created.');
    res.redirect('/payment-methods');
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const updated = await service.update(req.params.id, req.session.user.id, req.body);
    if (!updated) req.flash('error', 'Payment method not found.');
    else req.flash('success', 'Payment method updated.');
    res.redirect('/payment-methods');
  } catch (err) {
    next(err);
  }
};

const toggle = async (req, res, next) => {
  try {
    const pm = await service.toggle(req.params.id, req.session.user.id);
    if (!pm) req.flash('error', 'Payment method not found.');
    else req.flash('success', `Payment method ${pm.is_active ? 'activated' : 'deactivated'}.`);
    res.redirect('/payment-methods');
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    await service.remove(req.params.id, req.session.user.id);
    req.flash('success', 'Payment method deleted.');
    res.redirect('/payment-methods');
  } catch (err) {
    next(err);
  }
};

module.exports = { index, create, update, toggle, destroy };
