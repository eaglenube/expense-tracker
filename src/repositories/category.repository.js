const { Op } = require('sequelize');
const { Category, Expense } = require('../../models');

const findAllForUser = async (userId, { search, page, limit }) => {
  const where = { user_id: userId };
  if (search) where.name = { [Op.iLike]: `%${search}%` };
  const { rows, count } = await Category.findAndCountAll({
    where,
    order: [['name', 'ASC']],
    limit,
    offset: (page - 1) * limit,
  });
  return { rows, count };
};

const listForUser = (userId) =>
  Category.findAll({ where: { user_id: userId }, order: [['name', 'ASC']] });

const findById = (id, userId) =>
  Category.findOne({ where: { id, user_id: userId } });

const create = (data) => Category.create(data);

const update = async (id, userId, data) => {
  const cat = await findById(id, userId);
  if (!cat) return null;
  await cat.update(data);
  return cat;
};

const remove = async (id, userId) => {
  const count = await Expense.count({ where: { category_id: id, user_id: userId } });
  if (count > 0) {
    const err = new Error('Cannot delete category in use by expenses.');
    err.status = 400;
    throw err;
  }
  return Category.destroy({ where: { id, user_id: userId } });
};

module.exports = { findAllForUser, listForUser, findById, create, update, remove };
