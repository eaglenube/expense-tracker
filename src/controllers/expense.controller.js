const expenseService = require('../services/expense.service');
const categoryService = require('../services/category.service');
const paymentMethodService = require('../services/payment-method.service');
const { buildPagination, paginate } = require('../utils/pagination');

const index = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const { page, limit } = buildPagination({ page: req.query.page, limit: 10 });
    const filters = {
      search: req.query.search,
      category: req.query.category,
      payment_method: req.query.payment_method,
      from_date: req.query.from_date,
      to_date: req.query.to_date,
      sort: req.query.sort,
      order: req.query.order,
      page,
      limit,
    };
    const { rows, count } = await expenseService.list(userId, filters);
    const [categories, paymentMethods] = await Promise.all([
      categoryService.dropdown(userId),
      paymentMethodService.dropdown(userId),
    ]);
    const editing = req.query.edit ? await expenseService.findById(req.query.edit, userId) : null;

    res.render('expenses/index', {
      title: 'Expenses',
      items: rows,
      pagination: paginate(count, page, limit),
      filters: req.query,
      categories,
      paymentMethods,
      editing,
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    await expenseService.create(req.session.user.id, req.body, req.file);
    req.flash('success', 'Expense recorded.');
    res.redirect('/expenses');
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const updated = await expenseService.update(req.params.id, req.session.user.id, req.body, req.file);
    if (!updated) req.flash('error', 'Expense not found.');
    else req.flash('success', 'Expense updated.');
    res.redirect('/expenses');
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    await expenseService.remove(req.params.id, req.session.user.id);
    req.flash('success', 'Expense deleted.');
    res.redirect('/expenses');
  } catch (err) {
    next(err);
  }
};

module.exports = { index, create, update, destroy };
