const { validationResult } = require('express-validator');

const handleValidation = (redirectBack = true) => (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const errorMap = {};
  errors.array().forEach((e) => {
    if (!errorMap[e.path]) errorMap[e.path] = e.msg;
  });

  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(422).json({ errors: errorMap });
  }

  req.flash('error', Object.values(errorMap).join(' • '));
  if (redirectBack) {
    return res.redirect(req.get('referer') || '/');
  }
  next();
};

module.exports = { handleValidation };
