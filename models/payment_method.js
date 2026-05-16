'use strict';

module.exports = (sequelize, DataTypes) => {
  const PaymentMethod = sequelize.define(
    'PaymentMethod',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      user_id: { type: DataTypes.UUID, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      type: {
        type: DataTypes.ENUM(
          'Bank Account',
          'Debit Card',
          'Credit Card',
          'Cash',
          'Wallet',
          'UPI',
          'Other'
        ),
        allowNull: false,
        defaultValue: 'Cash',
      },
      account_holder_name: { type: DataTypes.STRING },
      bank_name: { type: DataTypes.STRING },
      account_number_last4: { type: DataTypes.STRING(4) },
      card_last4: { type: DataTypes.STRING(4) },
      wallet_provider: { type: DataTypes.STRING },
      opening_balance: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
      current_balance: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
      currency: { type: DataTypes.STRING(8), defaultValue: 'INR' },
      color: { type: DataTypes.STRING, defaultValue: '#0ea5e9' },
      icon: { type: DataTypes.STRING, defaultValue: 'bi-credit-card-2-front' },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: 'payment_methods' }
  );

  PaymentMethod.associate = (models) => {
    PaymentMethod.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    PaymentMethod.hasMany(models.Expense, { foreignKey: 'payment_method_id', as: 'expenses' });
    PaymentMethod.hasMany(models.Income, { foreignKey: 'payment_method_id', as: 'incomes' });
  };

  return PaymentMethod;
};
