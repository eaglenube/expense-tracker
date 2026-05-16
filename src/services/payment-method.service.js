const repo = require('../repositories/payment-method.repository');
const { sequelize } = require('../../models');

const toNumber = (v) => (v === '' || v === null || v === undefined ? 0 : Number(v));

const list = (userId, opts) => repo.findAllForUser(userId, opts);
const dropdown = (userId) => repo.listForUser(userId);
const findById = (id, userId) => repo.findById(id, userId);

const create = async (userId, data) => {
  const opening = toNumber(data.opening_balance);
  return repo.create({
    ...data,
    user_id: userId,
    opening_balance: opening,
    current_balance: opening,
    is_active: data.is_active === undefined ? true : (data.is_active === 'true' || data.is_active === true),
  });
};

const update = async (id, userId, data) => {
  return sequelize.transaction(async (t) => {
    const pm = await repo.findById(id, userId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!pm) return null;
    const newOpening = data.opening_balance !== undefined ? toNumber(data.opening_balance) : Number(pm.opening_balance);
    const delta = newOpening - Number(pm.opening_balance);
    const newCurrent = Number(pm.current_balance) + delta;
    await repo.update(
      pm,
      {
        ...data,
        opening_balance: newOpening,
        current_balance: newCurrent,
        is_active: data.is_active === undefined ? pm.is_active : (data.is_active === 'true' || data.is_active === true),
      },
      { transaction: t }
    );
    return pm;
  });
};

const toggle = async (id, userId) => {
  const pm = await repo.findById(id, userId);
  if (!pm) return null;
  await pm.update({ is_active: !pm.is_active });
  return pm;
};

const remove = (id, userId) => repo.remove(id, userId);

module.exports = { list, dropdown, findById, create, update, toggle, remove };
