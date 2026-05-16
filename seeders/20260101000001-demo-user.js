'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const USER_ID = '11111111-1111-1111-1111-111111111111';

module.exports = {
  up: async (queryInterface) => {
    const hash = await bcrypt.hash('password123', 10);
    await queryInterface.bulkInsert('users', [
      {
        id: USER_ID,
        full_name: 'Admin User',
        email: 'admin@example.com',
        password: hash,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('user_settings', [
      {
        id: uuidv4(),
        user_id: USER_ID,
        monthly_summary_enabled: true,
        monthly_summary_day: 1,
        summary_email: 'admin@example.com',
        timezone: 'Asia/Kolkata',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('user_settings', { user_id: USER_ID });
    await queryInterface.bulkDelete('users', { id: USER_ID });
  },
};
