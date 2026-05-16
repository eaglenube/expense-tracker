const { formatCurrency, formatDate, monthName } = require('../../helpers/format');

const card = (label, value, color) => `
  <td style="padding: 8px;">
    <div style="background:${color}11; border-left:4px solid ${color}; padding:12px 14px; border-radius:8px;">
      <div style="font-size:11px; text-transform:uppercase; color:#64748b; letter-spacing:.04em;">${label}</div>
      <div style="font-size:18px; font-weight:700; color:#0f172a;">${value}</div>
    </div>
  </td>`;

const render = ({ user, year, month, summary, byCategory, byPayment, recentExpenses, recentIncomes }) => {
  const period = `${monthName(month)} ${year}`;
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Monthly Summary</title></head>
<body style="margin:0; background:#f6f7fb; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#0f172a;">
  <div style="max-width:640px; margin:0 auto; padding:24px;">
    <div style="background:#fff; border-radius:14px; padding:24px; box-shadow:0 1px 2px rgba(15,23,42,.04), 0 4px 16px rgba(15,23,42,.06);">
      <h1 style="margin:0 0 4px; color:#6366f1;">Monthly Summary</h1>
      <p style="margin:0 0 18px; color:#64748b;">Hi ${user.full_name}, here's your ${period} financial recap.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;">
        <tr>
          ${card('Income', formatCurrency(summary.totalIncome), '#16a34a')}
          ${card('Expense', formatCurrency(summary.totalExpense), '#ef4444')}
          ${card('Net', formatCurrency(summary.totalIncome - summary.totalExpense), '#6366f1')}
        </tr>
      </table>

      <h2 style="margin-top:24px; font-size:16px;">Expense by Category</h2>
      <table width="100%" cellpadding="6" style="border-collapse:collapse; font-size:14px;">
        <thead><tr style="background:#f9fafb;"><th align="left">Category</th><th align="right">Total</th></tr></thead>
        <tbody>
          ${byCategory.length ? byCategory.map((r) => `<tr><td>${r.name}</td><td align="right"><strong>${formatCurrency(r.total)}</strong></td></tr>`).join('') : '<tr><td colspan="2" style="color:#64748b;">No expenses recorded.</td></tr>'}
        </tbody>
      </table>

      <h2 style="margin-top:24px; font-size:16px;">Payment Method Breakdown</h2>
      <table width="100%" cellpadding="6" style="border-collapse:collapse; font-size:14px;">
        <thead><tr style="background:#f9fafb;"><th align="left">Method</th><th align="right">Total</th></tr></thead>
        <tbody>
          ${byPayment.length ? byPayment.map((r) => `<tr><td>${r.name}</td><td align="right"><strong>${formatCurrency(r.total)}</strong></td></tr>`).join('') : '<tr><td colspan="2" style="color:#64748b;">No data.</td></tr>'}
        </tbody>
      </table>

      <h2 style="margin-top:24px; font-size:16px;">Recent Transactions</h2>
      <table width="100%" cellpadding="6" style="border-collapse:collapse; font-size:14px;">
        <thead><tr style="background:#f9fafb;"><th align="left">Date</th><th align="left">Title</th><th align="right">Amount</th></tr></thead>
        <tbody>
          ${recentExpenses.map((e) => `<tr><td>${formatDate(e.expense_date)}</td><td>${e.title}</td><td align="right" style="color:#ef4444;">- ${formatCurrency(e.amount)}</td></tr>`).join('')}
          ${recentIncomes.map((i) => `<tr><td>${formatDate(i.income_date)}</td><td>${i.title}</td><td align="right" style="color:#16a34a;">+ ${formatCurrency(i.amount)}</td></tr>`).join('')}
        </tbody>
      </table>

      <p style="margin-top:24px; color:#64748b; font-size:12px;">You're receiving this email because monthly summaries are enabled in your settings. Manage preferences inside the app.</p>
    </div>
  </div>
</body></html>`;
};

module.exports = { render };
