'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payment_methods', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: { type: Sequelize.STRING, allowNull: false },
      type: {
        type: Sequelize.ENUM(
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
      account_holder_name: { type: Sequelize.STRING },
      bank_name: { type: Sequelize.STRING },
      account_number_last4: { type: Sequelize.STRING(4) },
      card_last4: { type: Sequelize.STRING(4) },
      wallet_provider: { type: Sequelize.STRING },
      opening_balance: { type: Sequelize.DECIMAL(14, 2), defaultValue: 0 },
      current_balance: { type: Sequelize.DECIMAL(14, 2), defaultValue: 0 },
      currency: { type: Sequelize.STRING(8), defaultValue: 'INR' },
      color: { type: Sequelize.STRING, defaultValue: '#0ea5e9' },
      icon: { type: Sequelize.STRING, defaultValue: 'bi-credit-card-2-front' },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('payment_methods', ['user_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('payment_methods');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_payment_methods_type";');
  },
};
