const { verify } = require('../utils/jwt');
const { fail } = require('../utils/api-response');

const apiAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return fail(res, 'Missing or invalid Authorization header', 401);

  try {
    const payload = verify(token);
    req.user = { id: payload.sub, email: payload.email, full_name: payload.full_name };
    next();
  } catch (err) {
    return fail(res, 'Invalid or expired token', 401);
  }
};

const apiValidate = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const details = {};
  errors.array().forEach((e) => {
    if (!details[e.path]) details[e.path] = e.msg;
  });
  return fail(res, 'Validation failed', 422, details);
};

const apiErrorHandler = (err, req, res, _next) => {
  console.error('[api error]', err);
  const status = err.status || 500;
  return fail(res, err.message || 'Internal Server Error', status);
};

const apiNotFound = (req, res) => fail(res, 'Resource not found', 404);

module.exports = { apiAuth, apiValidate, apiErrorHandler, apiNotFound };
