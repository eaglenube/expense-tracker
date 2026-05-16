const service = require('../services/category.service');
const { buildPagination, paginate } = require('../utils/pagination');

const index = async (req, res, next) => {
  try {
    const { page, limit, offset } = buildPagination({ page: req.query.page, limit: 10 });
    const { rows, count } = await service.list(req.session.user.id, {
      search: req.query.search,
      page,
      limit,
    });
    res.render('categories/index', {
      title: 'Categories',
      items: rows,
      pagination: paginate(count, page, limit),
      filters: req.query,
      editing: req.query.edit ? await service.findById(req.query.edit, req.session.user.id) : null,
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    await service.create(req.session.user.id, req.body);
    req.flash('success', 'Category created.');
    res.redirect('/categories');
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const updated = await service.update(req.params.id, req.session.user.id, req.body);
    if (!updated) {
      req.flash('error', 'Category not found.');
    } else {
      req.flash('success', 'Category updated.');
    }
    res.redirect('/categories');
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    await service.remove(req.params.id, req.session.user.id);
    req.flash('success', 'Category deleted.');
    res.redirect('/categories');
  } catch (err) {
    if (err.status === 400) {
      req.flash('error', err.message);
      return res.redirect('/categories');
    }
    next(err);
  }
};

module.exports = { index, create, update, destroy };
