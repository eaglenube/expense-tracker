const bcrypt = require('bcryptjs');
const userRepo = require('../repositories/user.repository');
const { sequelize, UserSetting } = require('../../models');

const register = async ({ full_name, email, password }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    const err = new Error('An account with this email already exists.');
    err.status = 409;
    throw err;
  }
  const hash = await bcrypt.hash(password, 10);
  return sequelize.transaction(async (t) => {
    const user = await userRepo.create(
      { full_name, email, password: hash },
      { transaction: t }
    );
    await UserSetting.create(
      { user_id: user.id, summary_email: email },
      { transaction: t }
    );
    return user;
  });
};

const verify = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }
  return user;
};

const sessionUser = (user) => ({
  id: user.id,
  full_name: user.full_name,
  email: user.email,
});

module.exports = { register, verify, sessionUser };
