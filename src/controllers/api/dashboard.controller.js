const service = require('../../services/dashboard.service');
const { ok, asyncHandler } = require('../../utils/api-response');

const overview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const [summary, byCategory, trends, pmUsage, recent, topCats] = await Promise.all([
    service.getSummary(userId),
    service.expenseByCategory(userId),
    service.monthlyTrends(userId),
    service.paymentMethodUsage(userId),
    service.recentTransactions(userId),
    service.topSpendingCategories(userId),
  ]);
  return ok(res, {
    summary,
    byCategory,
    trends,
    pmUsage,
    recent,
    topCats,
  });
});

const summary = asyncHandler(async (req, res) => {
  const data = await service.getSummary(req.user.id);
  return ok(res, data);
});

const chartCategory = asyncHandler(async (req, res) => {
  const data = await service.expenseByCategory(req.user.id);
  return ok(res, { items: data });
});

const chartTrends = asyncHandler(async (req, res) => {
  const data = await service.monthlyTrends(req.user.id);
  return ok(res, data);
});

const chartPaymentMethod = asyncHandler(async (req, res) => {
  const data = await service.paymentMethodUsage(req.user.id);
  return ok(res, { items: data });
});

module.exports = { overview, summary, chartCategory, chartTrends, chartPaymentMethod };
