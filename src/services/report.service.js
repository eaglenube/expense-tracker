const { Op, fn, col, literal } = require('sequelize');
const { Expense, Income, Category, PaymentMethod } = require('../../models');

const dateWhere = (field, from, to) => {
  if (!from && !to) return {};
  const w = {};
  if (from) w[Op.gte] = from;
  if (to) w[Op.lte] = to;
  return { [field]: w };
};

const summary = async (userId, { from_date, to_date }) => {
  const expWhere = { user_id: userId, ...dateWhere('expense_date', from_date, to_date) };
  const incWhere = { user_id: userId, ...dateWhere('income_date', from_date, to_date) };
  const totalExpense = Number((await Expense.sum('amount', { where: expWhere })) || 0);
  const totalIncome = Number((await Income.sum('amount', { where: incWhere })) || 0);

  const byCategory = await Expense.findAll({
    where: expWhere,
    attributes: [
      [col('category.name'), 'name'],
      [col('category.color'), 'color'],
      [fn('SUM', col('Expense.amount')), 'total'],
    ],
    include: [{ model: Category, as: 'category', attributes: [] }],
    group: ['category.id', 'category.name', 'category.color'],
    order: [[literal('total'), 'DESC']],
    raw: true,
  });

  const byPayment = await Expense.findAll({
    where: expWhere,
    attributes: [
      [col('paymentMethod.name'), 'name'],
      [col('paymentMethod.color'), 'color'],
      [fn('SUM', col('Expense.amount')), 'total'],
    ],
    include: [{ model: PaymentMethod, as: 'paymentMethod', attributes: [] }],
    group: ['paymentMethod.id', 'paymentMethod.name', 'paymentMethod.color'],
    order: [[literal('total'), 'DESC']],
    raw: true,
  });

  return {
    totalExpense,
    totalIncome,
    net: totalIncome - totalExpense,
    byCategory: byCategory.map((r) => ({ ...r, total: Number(r.total) })),
    byPayment: byPayment.map((r) => ({ ...r, total: Number(r.total) })).filter((r) => r.name),
  };
};

const csvForExpenses = async (userId, { from_date, to_date }) => {
  const where = { user_id: userId, ...dateWhere('expense_date', from_date, to_date) };
  const rows = await Expense.findAll({
    where,
    include: [
      { model: Category, as: 'category' },
      { model: PaymentMethod, as: 'paymentMethod' },
    ],
    order: [['expense_date', 'DESC']],
  });
  const headers = ['Date', 'Title', 'Category', 'Payment Method', 'Amount', 'Description'];
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [headers.join(',')];
  rows.forEach((r) => {
    lines.push(
      [
        r.expense_date,
        escape(r.title),
        escape(r.category ? r.category.name : ''),
        escape(r.paymentMethod ? r.paymentMethod.name : ''),
        r.amount,
        escape(r.description || ''),
      ].join(',')
    );
  });
  return lines.join('\n');
};

module.exports = { summary, csvForExpenses };
