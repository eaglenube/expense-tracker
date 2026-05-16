'use strict';

module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define(
    'Expense',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      user_id: { type: DataTypes.UUID, allowNull: false },
      category_id: { type: DataTypes.UUID, allowNull: false },
      payment_method_id: { type: DataTypes.UUID, allowNull: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
      expense_date: { type: DataTypes.DATEONLY, allowNull: false },
      attachment_path: { type: DataTypes.STRING },
      attachment_name: { type: DataTypes.STRING },
      attachment_type: { type: DataTypes.STRING },
    },
    { tableName: 'expenses' }
  );

  Expense.associate = (models) => {
    Expense.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Expense.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    Expense.belongsTo(models.PaymentMethod, { foreignKey: 'payment_method_id', as: 'paymentMethod' });
  };

  return Expense;
};
