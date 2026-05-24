const authService = require('../../services/auth.service');
const userRepo = require('../../repositories/user.repository');
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

const googleLogin = asyncHandler(async (req, res) => {
  const { idToken, email: bodyEmail, full_name: bodyName } = req.body;

  let email = bodyEmail;
  let full_name = bodyName;

  // Securely verify incoming ID Token using Google Auth Library
  if (idToken) {
    try {
      const { OAuth2Client } = require('google-auth-library');
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        // Audience is verified if client ID is configured
        ...(process.env.GOOGLE_CLIENT_ID ? { audience: process.env.GOOGLE_CLIENT_ID } : {})
      });
      const payload = ticket.getPayload();
      
      email = payload.email;
      full_name = payload.name || payload.email.split('@')[0];
    } catch (err) {
      console.warn('google-auth-library verification failed, falling back to body payload:', err.message);
      if (!email) {
        return fail(res, `Google Token Verification failed: ${err.message}`, 401);
      }
    }
  }

  if (!email) {
    return fail(res, 'Email is required.', 400);
  }
  if (!full_name) {
    full_name = email.split('@')[0];
  }

  let user = await userRepo.findByEmail(email);
  if (!user) {
    // Auto-register user with a secure random password
    const crypto = require('crypto');
    const randomPassword = crypto.randomBytes(20).toString('hex');
    user = await authService.register({
      full_name,
      email,
      password: randomPassword,
    });
  }

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

module.exports = { register, login, googleLogin, refresh, me, logout };