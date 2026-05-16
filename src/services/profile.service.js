const bcrypt = require('bcryptjs');
const { User } = require('../../models');

const updateProfile = async (userId, { full_name, email }) => {
  const user = await User.findByPk(userId);
  if (!user) return null;
  if (email && email !== user.email) {
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      const err = new Error('Email is already in use.');
      err.status = 409;
      throw err;
    }
  }
  await user.update({ full_name, email });
  return user;
};

const updatePassword = async (userId, { current_password, new_password }) => {
  const user = await User.findByPk(userId);
  if (!user) return null;
  const ok = await bcrypt.compare(current_password, user.password);
  if (!ok) {
    const err = new Error('Current password is incorrect.');
    err.status = 400;
    throw err;
  }
  if (!new_password || new_password.length < 6) {
    const err = new Error('New password must be at least 6 characters.');
    err.status = 400;
    throw err;
  }
  const hash = await bcrypt.hash(new_password, 10);
  await user.update({ password: hash });
  return user;
};

module.exports = { updateProfile, updatePassword };
