const authService = require('../../services/auth.service');
const { User } = require('../../../models');
const { signAccess, signRefresh, verifyRefresh } = require('../../utils/jwt');
const { ok, fail, asyncHandler } = require('../../utils/api-response');

const issueTokens = (user) => ({
  token: signAccess({ sub: user.id, email: user.email, full_name: user.full_name }),
  refreshToken: signRefresh({ sub: user.id }),
});

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  return ok(res, { user: authService.sessionUser(user), ...issueTokens(user) }, 201);
});

const login = asyncHandler(async (req, res) => {
  const user = await authService.verify(req.body);
  return ok(res, { user: authService.sessionUser(user), ...issueTokens(user) });
});

const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refresh_token || req.body.refreshToken;
  if (!refreshToken) return fail(res, 'refresh_token is required', 400);

  let payload;
  try {
    payload = verifyRefresh(refreshToken);
  } catch (err) {
    return fail(res, 'Invalid or expired refresh token', 401);
  }

  const user = await User.findByPk(payload.sub);
  if (!user) return fail(res, 'User no longer exists', 401);

  return ok(res, { user: authService.sessionUser(user), ...issueTokens(user) });
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ['id', 'full_name', 'email', 'created_at', 'updated_at'],
  });
  if (!user) return fail(res, 'User not found', 404);
  return ok(res, { user });
});

const logout = (req, res) => ok(res, { message: 'Discard the token on the client.' });

module.exports = { register, login, refresh, me, logout };
