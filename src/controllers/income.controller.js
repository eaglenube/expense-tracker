const incomeService = require('../services/income.service');
const paymentMethodService = require('../services/payment-method.service');
const { buildPagination, paginate } = require('../utils/pagination');

const index = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const { page, limit } = buildPagination({ page: req.query.page, limit: 10 });
    const filters = {
      search: req.query.search,
      payment_method: req.query.payment_method,
      from_date: req.query.from_date,
      to_date: req.query.to_date,
      sort: req.query.sort,
      order: req.query.order,
      page,
      limit,
    };
    const { rows, count } = await incomeService.list(userId, filters);
    const paymentMethods = await paymentMethodService.dropdown(userId);
    const editing = req.query.edit ? await incomeService.findById(req.query.edit, userId) : null;
    res.render('incomes/index', {
      title: 'Incomes',
      items: rows,
      pagination: paginate(count, page, limit),
      filters: req.query,
      paymentMethods,
      editing,
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    await incomeService.create(req.session.user.id, req.body, req.file);
    req.flash('success', 'Income recorded.');
    res.redirect('/incomes');
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const updated = await incomeService.update(req.params.id, req.session.user.id, req.body, req.file);
    if (!updated) req.flash('error', 'Income not found.');
    else req.flash('success', 'Income updated.');
    res.redirect('/incomes');
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    await incomeService.remove(req.params.id, req.session.user.id);
    req.flash('success', 'Income deleted.');
    res.redirect('/incomes');
  } catch (err) {
    next(err);
  }
};

module.exports = { index, create, update, destroy };
