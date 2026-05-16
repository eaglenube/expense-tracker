const { Op, fn, col, literal } = require('sequelize');
const { Expense, Income, Category, PaymentMethod, sequelize } = require('../../models');

const monthRange = (date = new Date()) => {
  const y = date.getFullYear();
  const m = date.getMonth();
  return {
    start: new Date(y, m, 1).toISOString().slice(0, 10),
    end: new Date(y, m + 1, 0).toISOString().slice(0, 10),
  };
};

const sumExpenses = async (userId, where = {}) => {
  const v = await Expense.sum('amount', { where: { user_id: userId, ...where } });
  return Number(v || 0);
};
const sumIncomes = async (userId, where = {}) => {
  const v = await Income.sum('amount', { where: { user_id: userId, ...where } });
  return Number(v || 0);
};

const getSummary = async (userId) => {
  const month = monthRange();
  const totalIncome = await sumIncomes(userId);
  const totalExpense = await sumExpenses(userId);
  const monthIncome = await sumIncomes(userId, { income_date: { [Op.between]: [month.start, month.end] } });
  const monthExpense = await sumExpenses(userId, { expense_date: { [Op.between]: [month.start, month.end] } });

  const cashMethod = await PaymentMethod.findOne({ where: { user_id: userId, type: 'Cash' } });
  const accounts = await PaymentMethod.findAll({
    where: { user_id: userId, is_active: true },
    order: [['name', 'ASC']],
  });

  return {
    totalIncome,
    totalExpense,
    monthIncome,
    monthExpense,
    remaining: totalIncome - totalExpense,
    monthRemaining: monthIncome - monthExpense,
    cashBalance: cashMethod ? Number(cashMethod.current_balance) : 0,
    accounts,
  };
};

const expenseByCategory = async (userId) => {
  const month = monthRange();
  const rows = await Expense.findAll({
    where: { user_id: userId, expense_date: { [Op.between]: [month.start, month.end] } },
    attributes: [
      [col('category.id'), 'category_id'],
      [col('category.name'), 'name'],
      [col('category.color'), 'color'],
      [fn('SUM', col('Expense.amount')), 'total'],
    ],
    include: [{ model: Category, as: 'category', attributes: [] }],
    group: ['category.id', 'category.name', 'category.color'],
    raw: true,
  });
  return rows.map((r) => ({ name: r.name || 'Uncategorised', color: r.color || '#94a3b8', total: Number(r.total) }));
};

const monthlyTrends = async (userId) => {
  const today = new Date();
  const labels = [];
  const expenses = [];
  const incomes = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const range = monthRange(d);
    labels.push(d.toLocaleString('en-US', { month: 'short', year: '2-digit' }));
    expenses.push(await sumExpenses(userId, { expense_date: { [Op.between]: [range.start, range.end] } }));
    incomes.push(await sumIncomes(userId, { income_date: { [Op.between]: [range.start, range.end] } }));
  }
  return { labels, expenses, incomes };
};

const paymentMethodUsage = async (userId) => {
  const rows = await Expense.findAll({
    where: { user_id: userId },
    attributes: [
      [col('paymentMethod.name'), 'name'],
      [col('paymentMethod.color'), 'color'],
      [fn('SUM', col('Expense.amount')), 'total'],
    ],
    include: [{ model: PaymentMethod, as: 'paymentMethod', attributes: [] }],
    group: ['paymentMethod.id', 'paymentMethod.name', 'paymentMethod.color'],
    raw: true,
  });
  return rows
    .filter((r) => r.name)
    .map((r) => ({ name: r.name, color: r.color || '#6366f1', total: Number(r.total) }));
};

const recentTransactions = async (userId) => {
  const [recentExpenses, recentIncomes] = await Promise.all([
    Expense.findAll({
      where: { user_id: userId },
      include: [
        { model: Category, as: 'category' },
        { model: PaymentMethod, as: 'paymentMethod' },
      ],
      order: [['created_at', 'DESC']],
      limit: 5,
    }),
    Income.findAll({
      where: { user_id: userId },
      include: [{ model: PaymentMethod, as: 'paymentMethod' }],
      order: [['created_at', 'DESC']],
      limit: 5,
    }),
  ]);
  return { recentExpenses, recentIncomes };
};

const topSpendingCategories = async (userId) => {
  const rows = await Expense.findAll({
    where: { user_id: userId },
    attributes: [
      [col('category.id'), 'id'],
      [col('category.name'), 'name'],
      [col('category.color'), 'color'],
      [col('category.icon'), 'icon'],
      [fn('SUM', col('Expense.amount')), 'total'],
    ],
    include: [{ model: Category, as: 'category', attributes: [] }],
    group: ['category.id', 'category.name', 'category.color', 'category.icon'],
    order: [[literal('total'), 'DESC']],
    limit: 5,
    raw: true,
  });
  return rows.map((r) => ({ ...r, total: Number(r.total) }));
};

module.exports = {
  monthRange,
  getSummary,
  expenseByCategory,
  monthlyTrends,
  paymentMethodUsage,
  recentTransactions,
  topSpendingCategories,
};
