'use strict';

const USER_ID = '11111111-1111-1111-1111-111111111111';

const CATEGORIES = [
  { id: 'aaaaaaa1-0000-0000-0000-000000000001', name: 'Food & Dining', color: '#ef4444', icon: 'bi-cup-hot' },
  { id: 'aaaaaaa1-0000-0000-0000-000000000002', name: 'Transport', color: '#0ea5e9', icon: 'bi-bus-front' },
  { id: 'aaaaaaa1-0000-0000-0000-000000000003', name: 'Shopping', color: '#a855f7', icon: 'bi-bag' },
  { id: 'aaaaaaa1-0000-0000-0000-000000000004', name: 'Bills & Utilities', color: '#f59e0b', icon: 'bi-receipt' },
  { id: 'aaaaaaa1-0000-0000-0000-000000000005', name: 'Health', color: '#16a34a', icon: 'bi-heart-pulse' },
  { id: 'aaaaaaa1-0000-0000-0000-000000000006', name: 'Entertainment', color: '#ec4899', icon: 'bi-controller' },
];

const PAYMENT_METHODS = [
  { id: 'bbbbbbb2-0000-0000-0000-000000000001', name: 'HDFC Salary Account', type: 'Bank Account', bank_name: 'HDFC Bank', account_holder_name: 'Admin User', account_number_last4: '4521', opening_balance: 50000, current_balance: 50000, color: '#0f766e', icon: 'bi-bank' },
  { id: 'bbbbbbb2-0000-0000-0000-000000000002', name: 'SBI Savings', type: 'Bank Account', bank_name: 'State Bank of India', account_holder_name: 'Admin User', account_number_last4: '8810', opening_balance: 20000, current_balance: 20000, color: '#2563eb', icon: 'bi-bank' },
  { id: 'bbbbbbb2-0000-0000-0000-000000000003', name: 'ICICI Credit Card', type: 'Credit Card', bank_name: 'ICICI', card_last4: '3344', opening_balance: 0, current_balance: 0, color: '#dc2626', icon: 'bi-credit-card' },
  { id: 'bbbbbbb2-0000-0000-0000-000000000004', name: 'Cash Wallet', type: 'Cash', opening_balance: 3000, current_balance: 3000, color: '#f59e0b', icon: 'bi-cash' },
  { id: 'bbbbbbb2-0000-0000-0000-000000000005', name: 'Paytm', type: 'Wallet', wallet_provider: 'Paytm', opening_balance: 500, current_balance: 500, color: '#0ea5e9', icon: 'bi-wallet2' },
  { id: 'bbbbbbb2-0000-0000-0000-000000000006', name: 'Google Pay', type: 'UPI', wallet_provider: 'Google Pay', opening_balance: 0, current_balance: 0, color: '#22c55e', icon: 'bi-phone' },
];

const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const EXPENSES = [
  { title: 'Grocery shopping', amount: 1850, category: 0, payment: 0, expense_date: daysAgo(1), description: 'Weekly groceries' },
  { title: 'Uber to office', amount: 220, category: 1, payment: 3, expense_date: daysAgo(2) },
  { title: 'Lunch with team', amount: 980, category: 0, payment: 2, expense_date: daysAgo(3) },
  { title: 'Electricity bill', amount: 1450, category: 3, payment: 0, expense_date: daysAgo(4) },
  { title: 'Netflix subscription', amount: 499, category: 5, payment: 2, expense_date: daysAgo(5) },
  { title: 'Pharmacy', amount: 360, category: 4, payment: 3, expense_date: daysAgo(6) },
  { title: 'Amazon order', amount: 2790, category: 2, payment: 2, expense_date: daysAgo(7) },
  { title: 'Petrol', amount: 1200, category: 1, payment: 0, expense_date: daysAgo(9) },
  { title: 'Coffee', amount: 180, category: 0, payment: 3, expense_date: daysAgo(11) },
  { title: 'Mobile recharge', amount: 299, category: 3, payment: 5, expense_date: daysAgo(13) },
];

const INCOMES = [
  { title: 'Monthly Salary', amount: 95000, payment: 0, source: 'Salary', income_date: daysAgo(15) },
  { title: 'Freelance project', amount: 25000, payment: 1, source: 'Freelance', income_date: daysAgo(8) },
  { title: 'Interest credit', amount: 320, payment: 1, source: 'Interest', income_date: daysAgo(3) },
];

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    await queryInterface.bulkInsert(
      'categories',
      CATEGORIES.map((c) => ({ ...c, user_id: USER_ID, created_at: now, updated_at: now }))
    );
    await queryInterface.bulkInsert(
      'payment_methods',
      PAYMENT_METHODS.map((p) => ({
        ...p,
        user_id: USER_ID,
        currency: 'INR',
        is_active: true,
        created_at: now,
        updated_at: now,
      }))
    );

    // Apply expenses with balance updates
    const balances = Object.fromEntries(PAYMENT_METHODS.map((p) => [p.id, p.opening_balance]));

    const expRows = EXPENSES.map((e, idx) => {
      const pm = PAYMENT_METHODS[e.payment];
      balances[pm.id] -= e.amount;
      return {
        id: `cccccccc-0000-0000-0000-${String(idx + 1).padStart(12, '0')}`,
        user_id: USER_ID,
        category_id: CATEGORIES[e.category].id,
        payment_method_id: pm.id,
        title: e.title,
        description: e.description || null,
        amount: e.amount,
        expense_date: e.expense_date,
        created_at: now,
        updated_at: now,
      };
    });
    await queryInterface.bulkInsert('expenses', expRows);

    const incRows = INCOMES.map((i, idx) => {
      const pm = PAYMENT_METHODS[i.payment];
      balances[pm.id] += i.amount;
      return {
        id: `dddddddd-0000-0000-0000-${String(idx + 1).padStart(12, '0')}`,
        user_id: USER_ID,
        payment_method_id: pm.id,
        title: i.title,
        description: null,
        amount: i.amount,
        income_date: i.income_date,
        source: i.source,
        created_at: now,
        updated_at: now,
      };
    });
    await queryInterface.bulkInsert('incomes', incRows);

    for (const [id, bal] of Object.entries(balances)) {
      await queryInterface.sequelize.query(
        'UPDATE payment_methods SET current_balance = :bal WHERE id = :id',
        { replacements: { bal, id } }
      );
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('incomes', { user_id: USER_ID });
    await queryInterface.bulkDelete('expenses', { user_id: USER_ID });
    await queryInterface.bulkDelete('payment_methods', { user_id: USER_ID });
    await queryInterface.bulkDelete('categories', { user_id: USER_ID });
  },
};
