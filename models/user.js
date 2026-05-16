'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      full_name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: 'users' }
  );

  User.associate = (models) => {
    User.hasMany(models.Category, { foreignKey: 'user_id', as: 'categories', onDelete: 'CASCADE' });
    User.hasMany(models.PaymentMethod, { foreignKey: 'user_id', as: 'paymentMethods', onDelete: 'CASCADE' });
    User.hasMany(models.Expense, { foreignKey: 'user_id', as: 'expenses', onDelete: 'CASCADE' });
    User.hasMany(models.Income, { foreignKey: 'user_id', as: 'incomes', onDelete: 'CASCADE' });
    User.hasOne(models.UserSetting, { foreignKey: 'user_id', as: 'settings', onDelete: 'CASCADE' });
  };

  return User;
};
