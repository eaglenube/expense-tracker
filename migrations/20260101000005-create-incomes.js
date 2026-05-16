'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('incomes', {
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
      payment_method_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'payment_methods', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      amount: { type: Sequelize.DECIMAL(14, 2), allowNull: false },
      income_date: { type: Sequelize.DATEONLY, allowNull: false },
      source: { type: Sequelize.STRING },
      attachment_path: { type: Sequelize.STRING },
      attachment_name: { type: Sequelize.STRING },
      attachment_type: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('incomes', ['user_id']);
    await queryInterface.addIndex('incomes', ['payment_method_id']);
    await queryInterface.addIndex('incomes', ['income_date']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('incomes');
  },
};
