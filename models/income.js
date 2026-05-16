'use strict';

module.exports = (sequelize, DataTypes) => {
  const Income = sequelize.define(
    'Income',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      user_id: { type: DataTypes.UUID, allowNull: false },
      payment_method_id: { type: DataTypes.UUID, allowNull: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
      income_date: { type: DataTypes.DATEONLY, allowNull: false },
      source: { type: DataTypes.STRING },
      attachment_path: { type: DataTypes.STRING },
      attachment_name: { type: DataTypes.STRING },
      attachment_type: { type: DataTypes.STRING },
    },
    { tableName: 'incomes' }
  );

  Income.associate = (models) => {
    Income.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Income.belongsTo(models.PaymentMethod, { foreignKey: 'payment_method_id', as: 'paymentMethod' });
  };

  return Income;
};
