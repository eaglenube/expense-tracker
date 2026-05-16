'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_settings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      monthly_summary_enabled: { type: Sequelize.BOOLEAN, defaultValue: true },
      monthly_summary_day: { type: Sequelize.INTEGER, defaultValue: 1 },
      summary_email: { type: Sequelize.STRING },
      timezone: { type: Sequelize.STRING, defaultValue: 'Asia/Kolkata' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user_settings');
  },
};
