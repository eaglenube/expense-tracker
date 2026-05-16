const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || `${SECRET}-refresh`;
const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '60d';

const signAccess = (payload) =>
  jwt.sign({ ...payload, type: 'access' }, SECRET, { expiresIn: ACCESS_EXPIRES_IN });

const signRefresh = (payload) =>
  jwt.sign({ sub: payload.sub, type: 'refresh' }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });

const verifyAccess = (token) => {
  const payload = jwt.verify(token, SECRET);
  if (payload.type && payload.type !== 'access') {
    const err = new Error('Not an access token');
    err.name = 'JsonWebTokenError';
    throw err;
  }
  return payload;
};

const verifyRefresh = (token) => {
  const payload = jwt.verify(token, REFRESH_SECRET);
  if (payload.type !== 'refresh') {
    const err = new Error('Not a refresh token');
    err.name = 'JsonWebTokenError';
    throw err;
  }
  return payload;
};

// Back-compat aliases for callers that imported the old API
const sign = signAccess;
const verify = verifyAccess;

module.exports = { sign, verify, signAccess, verifyAccess, signRefresh, verifyRefresh };
