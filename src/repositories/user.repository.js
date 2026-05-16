const { User } = require('../../models');

const findByEmail = (email) => User.findOne({ where: { email } });

const findById = (id) => User.findByPk(id);

const create = (data, options = {}) => User.create(data, options);

const update = (id, data) => User.update(data, { where: { id }, returning: true });

module.exports = { findByEmail, findById, create, update };
