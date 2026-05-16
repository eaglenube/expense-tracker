const { Op } = require('sequelize');
const { PaymentMethod } = require('../../models');

const findAllForUser = async (userId, { search, type, is_active, page, limit }) => {
  const where = { user_id: userId };
  if (search) where.name = { [Op.iLike]: `%${search}%` };
  if (type) where.type = type;
  if (is_active !== undefined && is_active !== '') where.is_active = is_active === 'true' || is_active === true;
  const { rows, count } = await PaymentMethod.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit,
    offset: (page - 1) * limit,
  });
  return { rows, count };
};

const listForUser = (userId) =>
  PaymentMethod.findAll({ where: { user_id: userId, is_active: true }, order: [['name', 'ASC']] });

const findById = (id, userId, options = {}) =>
  PaymentMethod.findOne({ where: { id, user_id: userId }, ...options });

const create = (data, options = {}) => PaymentMethod.create(data, options);

const update = async (instance, data, options = {}) => instance.update(data, options);

const remove = (id, userId) =>
  PaymentMethod.destroy({ where: { id, user_id: userId } });

module.exports = { findAllForUser, listForUser, findById, create, update, remove };
