const service = require('../services/report.service');

const index = async (req, res, next) => {
  try {
    const data = await service.summary(req.session.user.id, req.query);
    res.render('reports/index', { title: 'Reports', data, filters: req.query });
  } catch (err) {
    next(err);
  }
};

const exportCsv = async (req, res, next) => {
  try {
    const csv = await service.csvForExpenses(req.session.user.id, req.query);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=expenses-${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

module.exports = { index, exportCsv };
