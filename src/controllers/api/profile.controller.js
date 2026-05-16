const service = require('../../services/profile.service');
const { User } = require('../../../models');
const { ok, fail, asyncHandler } = require('../../utils/api-response');

const get = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ['id', 'full_name', 'email', 'created_at', 'updated_at'],
  });
  if (!user) return fail(res, 'User not found', 404);
  return ok(res, { user });
});

const update = asyncHandler(async (req, res) => {
  const user = await service.updateProfile(req.user.id, req.body);
  if (!user) return fail(res, 'User not found', 404);
  return ok(res, {
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  });
});

const updatePassword = asyncHandler(async (req, res) => {
  await service.updatePassword(req.user.id, req.body);
  return ok(res, { message: 'Password updated.' });
});

module.exports = { get, update, updatePassword };
