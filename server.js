require('dotenv').config();

const app = require('./src/app');
const { sequelize } = require('./src/config/database');
const { startCronJobs } = require('./src/cron');

const PORT = parseInt(process.env.PORT || '3000', 10);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('[db] connection established');

    startCronJobs();

    app.listen(PORT, () => {
      console.log(`[app] Expense Tracker running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[startup] failed to start application:', err);
    process.exit(1);
  }
})();
