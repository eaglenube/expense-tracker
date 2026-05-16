const { Op } = require('sequelize');
const { Income, PaymentMethod } = require('../../models');

const buildWhere = (userId, filters) => {
  const where = { user_id: userId };
  if (filters.search) where.title = { [Op.iLike]: `%${filters.search}%` };
  if (filters.payment_method) where.payment_method_id = filters.payment_method;
  if (filters.from_date || filters.to_date) {
    where.income_date = {};
    if (filters.from_date) where.income_date[Op.gte] = filters.from_date;
    if (filters.to_date) where.income_date[Op.lte] = filters.to_date;
  }
  return where;
};

const allowedSort = ['income_date', 'amount', 'title', 'created_at'];

const findAll = async (userId, filters) => {
  const where = buildWhere(userId, filters);
  const sort = allowedSort.includes(filters.sort) ? filters.sort : 'income_date';
  const order = (filters.order || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  const { rows, count } = await Income.findAndCountAll({
    where,
    include: [{ model: PaymentMethod, as: 'paymentMethod' }],
    order: [[sort, order], ['created_at', 'DESC']],
    limit: filters.limit,
    offset: (filters.page - 1) * filters.limit,
  });
  return { rows, count };
};

const findById = (id, userId, options = {}) =>
  Income.findOne({
    where: { id, user_id: userId },
    include: [{ model: PaymentMethod, as: 'paymentMethod' }],
    ...options,
  });

const create = (data, options = {}) => Income.create(data, options);

const update = (instance, data, options = {}) => instance.update(data, options);

const remove = (instance, options = {}) => instance.destroy(options);

const sumByUser = (userId, where = {}) =>
  Income.sum('amount', { where: { user_id: userId, ...where } });

const all = (userId, where = {}, options = {}) =>
  Income.findAll({
    where: { user_id: userId, ...where },
    include: [{ model: PaymentMethod, as: 'paymentMethod' }],
    ...options,
  });

module.exports = { findAll, findById, create, update, remove, sumByUser, all };
