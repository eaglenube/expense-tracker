const { formatCurrency, formatDate, formatDateInput, monthName } = require('../helpers/format');

const attachLocals = (req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.flash = {
    success: req.flash('success'),
    error: req.flash('error'),
    info: req.flash('info'),
    warning: req.flash('warning'),
  };
  res.locals.currentPath = req.path;
  res.locals.query = req.query || {};
  res.locals.title = 'Expense Tracker';
  res.locals.formatCurrency = formatCurrency;
  res.locals.formatDate = formatDate;
  res.locals.formatDateInput = formatDateInput;
  res.locals.monthName = monthName;
  next();
};

module.exports = { attachLocals };
