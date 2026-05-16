const { UserSetting } = require('../../models');

const getForUser = async (userId) => {
  const [row] = await UserSetting.findOrCreate({
    where: { user_id: userId },
    defaults: { user_id: userId },
  });
  return row;
};

const updateForUser = async (userId, data) => {
  const settings = await getForUser(userId);
  await settings.update({
    monthly_summary_enabled: data.monthly_summary_enabled === 'on' || data.monthly_summary_enabled === 'true',
    monthly_summary_day: parseInt(data.monthly_summary_day || '1', 10),
    summary_email: data.summary_email,
    timezone: data.timezone,
  });
  return settings;
};

module.exports = { getForUser, updateForUser };
