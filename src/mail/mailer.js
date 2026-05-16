const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    transporter = {
      sendMail: async (opts) => {
        console.log('[mail] SMTP not configured — preview:', opts.subject, '→', opts.to);
        return { messageId: 'preview' };
      },
    };
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
};

const send = async ({ to, subject, html, text }) => {
  const t = getTransporter();
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'no-reply@example.com';
  const fromName = process.env.SMTP_FROM_NAME || 'Expense Tracker';
  return t.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
    text,
  });
};

module.exports = { send };
