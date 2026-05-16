const service = require('../services/dashboard.service');

const index = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const [summary, byCategory, trends, pmUsage, recent, topCats] = await Promise.all([
      service.getSummary(userId),
      service.expenseByCategory(userId),
      service.monthlyTrends(userId),
      service.paymentMethodUsage(userId),
      service.recentTransactions(userId),
      service.topSpendingCategories(userId),
    ]);
    res.render('dashboard/index', {
      title: 'Dashboard',
      summary,
      byCategory,
      trends,
      pmUsage,
      recent,
      topCats,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { index };
