'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserSetting = sequelize.define(
    'UserSetting',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      user_id: { type: DataTypes.UUID, allowNull: false, unique: true },
      monthly_summary_enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
      monthly_summary_day: { type: DataTypes.INTEGER, defaultValue: 1 },
      summary_email: { type: DataTypes.STRING },
      timezone: { type: DataTypes.STRING, defaultValue: 'Asia/Kolkata' },
    },
    { tableName: 'user_settings' }
  );

  UserSetting.associate = (models) => {
    UserSetting.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return UserSetting;
};
