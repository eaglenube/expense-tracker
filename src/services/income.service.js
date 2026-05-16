const fs = require('fs');
const path = require('path');
const { sequelize, PaymentMethod } = require('../../models');
const repo = require('../repositories/income.repository');

const adjustPaymentBalance = async (paymentMethodId, userId, delta, t) => {
  if (!paymentMethodId) return;
  const pm = await PaymentMethod.findOne({
    where: { id: paymentMethodId, user_id: userId },
    transaction: t,
    lock: t.LOCK.UPDATE,
  });
  if (!pm) return;
  const next = Number(pm.current_balance) + delta;
  await pm.update({ current_balance: next }, { transaction: t });
};

const list = (userId, filters) => repo.findAll(userId, filters);
const findById = (id, userId) => repo.findById(id, userId);

const create = async (userId, data, file) => {
  return sequelize.transaction(async (t) => {
    const amount = Number(data.amount);
    const payload = {
      user_id: userId,
      payment_method_id: data.payment_method_id || null,
      title: data.title,
      description: data.description || null,
      amount,
      income_date: data.income_date,
      source: data.source || null,
    };
    if (file) {
      payload.attachment_path = `/uploads/incomes/${file.filename}`;
      payload.attachment_name = file.originalname;
      payload.attachment_type = file.mimetype;
    }
    const income = await repo.create(payload, { transaction: t });
    await adjustPaymentBalance(payload.payment_method_id, userId, amount, t);
    return income;
  });
};

const update = async (id, userId, data, file) => {
  return sequelize.transaction(async (t) => {
    const existing = await repo.findById(id, userId, { transaction: t });
    if (!existing) return null;
    await adjustPaymentBalance(existing.payment_method_id, userId, -Number(existing.amount), t);

    const amount = Number(data.amount);
    const next = {
      payment_method_id: data.payment_method_id || null,
      title: data.title,
      description: data.description || null,
      amount,
      income_date: data.income_date,
      source: data.source || null,
    };
    if (file) {
      if (existing.attachment_path) removeAttachment(existing.attachment_path);
      next.attachment_path = `/uploads/incomes/${file.filename}`;
      next.attachment_name = file.originalname;
      next.attachment_type = file.mimetype;
    }
    if (data.remove_attachment === '1' && !file && existing.attachment_path) {
      removeAttachment(existing.attachment_path);
      next.attachment_path = null;
      next.attachment_name = null;
      next.attachment_type = null;
    }
    await repo.update(existing, next, { transaction: t });
    await adjustPaymentBalance(next.payment_method_id, userId, amount, t);
    return existing;
  });
};

const remove = async (id, userId) => {
  return sequelize.transaction(async (t) => {
    const existing = await repo.findById(id, userId, { transaction: t });
    if (!existing) return null;
    await adjustPaymentBalance(existing.payment_method_id, userId, -Number(existing.amount), t);
    if (existing.attachment_path) removeAttachment(existing.attachment_path);
    await repo.remove(existing, { transaction: t });
    return existing;
  });
};

function removeAttachment(relPath) {
  try {
    const abs = path.join(__dirname, '..', 'public', relPath.replace(/^\//, ''));
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch (e) {
    console.warn('[upload] failed to remove file', e.message);
  }
}

module.exports = { list, findById, create, update, remove };
