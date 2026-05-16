const cron = require('node-cron');
const monthlyReport = require('../services/monthly-report.service');

const startCronJobs = () => {
  // Run daily at 08:00 — sends to users whose monthly_summary_day matches today's date
  cron.schedule('0 8 * * *', async () => {
    console.log('[cron] running monthly-summary job');
    try {
      const sent = await monthlyReport.runForEligibleUsers();
      console.log(`[cron] monthly-summary sent ${sent} email(s)`);
    } catch (err) {
      console.error('[cron] monthly-summary failed:', err.message);
    }
  });
  console.log('[cron] scheduled monthly-summary job');
};

module.exports = { startCronJobs };
