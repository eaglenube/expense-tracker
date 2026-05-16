const { Op } = require('sequelize');
const { User, UserSetting, Expense, Income, Category, PaymentMethod } = require('../../models');
const reportService = require('./report.service');
const mailer = require('../mail/mailer');
const template = require('../mail/templates/monthly-summary');

const previousMonthRange = (now = new Date()) => {
  const y = now.getFullYear();
  const m = now.getMonth();
  const prev = new Date(y, m - 1, 1);
  const last = new Date(y, m, 0);
  return {
    year: prev.getFullYear(),
    month: prev.getMonth() + 1,
    start: prev.toISOString().slice(0, 10),
    end: last.toISOString().slice(0, 10),
  };
};

const buildAndSendForUser = async (user, settings, range) => {
  const summary = await reportService.summary(user.id, {
    from_date: range.start,
    to_date: range.end,
  });

  const recentExpenses = await Expense.findAll({
    where: { user_id: user.id, expense_date: { [Op.between]: [range.start, range.end] } },
    include: [{ model: Category, as: 'category' }, { model: PaymentMethod, as: 'paymentMethod' }],
    order: [['expense_date', 'DESC']],
    limit: 5,
  });
  const recentIncomes = await Income.findAll({
    where: { user_id: user.id, income_date: { [Op.between]: [range.start, range.end] } },
    include: [{ model: PaymentMethod, as: 'paymentMethod' }],
    order: [['income_date', 'DESC']],
    limit: 5,
  });

  const html = template.render({
    user,
    year: range.year,
    month: range.month,
    summary,
    byCategory: summary.byCategory,
    byPayment: summary.byPayment,
    recentExpenses,
    recentIncomes,
  });

  const to = (settings && settings.summary_email) || user.email;
  await mailer.send({
    to,
    subject: `Your Expense Summary — ${range.month}/${range.year}`,
    html,
    text: `Income: ${summary.totalIncome}, Expense: ${summary.totalExpense}, Net: ${summary.totalIncome - summary.totalExpense}`,
  });
};

const runForEligibleUsers = async () => {
  const today = new Date();
  const day = today.getDate();
  const range = previousMonthRange(today);

  const eligible = await User.findAll({
    include: [{ model: UserSetting, as: 'settings' }],
  });

  let sent = 0;
  for (const user of eligible) {
    const s = user.settings;
    if (!s || !s.monthly_summary_enabled) continue;
    if ((s.monthly_summary_day || 1) !== day) continue;
    try {
      await buildAndSendForUser(user, s, range);
      sent++;
    } catch (err) {
      console.error('[cron] failed to send monthly summary for', user.email, err.message);
    }
  }
  return sent;
};

module.exports = { runForEligibleUsers, buildAndSendForUser, previousMonthRange };
