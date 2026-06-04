const nodemailer = require('nodemailer');
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠️ Gmail SMTP not configured.');
    return null;
  }
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
  });
  return transporter;
}

async function sendEmail({ to, subject, html, from }) {
  const t = getTransporter();
  if (!t) return { success: false, error: 'Email not configured' };
  try {
    await t.sendMail({
      from: from || `"${process.env.BRAND_NAME || 'Vemunoori Collections'}" <${process.env.GMAIL_USER}>`,
      to, subject, html
    });
    return { success: true };
  } catch (err) {
    console.error('Email error:', err.message);
    return { success: false, error: err.message };
  }
}

async function sendBulkEmail({ recipients, subject, html, from, batchSize = 50, delayMs = 1000 }) {
  const t = getTransporter();
  if (!t) return { success: false, sent: 0, failed: 0, error: 'Email not configured' };
  let sent = 0, failed = 0;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    await Promise.all(batch.map(email =>
      sendEmail({ to: email, subject, html, from })
        .then(r => { if (r.success) sent++; else failed++; })
        .catch(() => failed++)
    ));
    if (i + batchSize < recipients.length) await new Promise(res => setTimeout(res, delayMs));
  }
  console.log(`📧 Bulk email: ${sent} sent, ${failed} failed`);
  return { success: true, sent, failed };
}

module.exports = { sendEmail, sendBulkEmail };
