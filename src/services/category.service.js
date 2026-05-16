const repo = require('../repositories/category.repository');

const list = (userId, opts) => repo.findAllForUser(userId, opts);
const dropdown = (userId) => repo.listForUser(userId);
const findById = (id, userId) => repo.findById(id, userId);
const create = (userId, data) => repo.create({ ...data, user_id: userId });
const update = (id, userId, data) => repo.update(id, userId, data);
const remove = (id, userId) => repo.remove(id, userId);

module.exports = { list, dropdown, findById, create, update, remove };
