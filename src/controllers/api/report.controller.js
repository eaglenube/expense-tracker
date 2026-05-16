const service = require('../../services/report.service');
const { ok, asyncHandler } = require('../../utils/api-response');

const summary = asyncHandler(async (req, res) => {
  const data = await service.summary(req.user.id, req.query);
  return ok(res, data);
});

const exportCsv = asyncHandler(async (req, res) => {
  const csv = await service.csvForExpenses(req.user.id, req.query);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=expenses-${Date.now()}.csv`);
  res.send(csv);
});

module.exports = { summary, exportCsv };
