const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠️ Gmail SMTP not configured. Emails will not be sent.');
    return null;
  }
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not your real password)
    },
  });
  return transporter;
}

/**
 * Send email to a single recipient
 */
async function sendEmail({ to, subject, html, from }) {
  const t = getTransporter();
  if (!t) return { success: false, error: 'Email not configured' };
  try {
    await t.sendMail({
      from: from || `"${process.env.BRAND_NAME || 'Vemunoori Collections'}" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error('Email send error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send email to multiple recipients in batches (to avoid Gmail limits)
 * Gmail free limit: 500 emails/day
 */
async function sendBulkEmail({ recipients, subject, html, from, batchSize = 50, delayMs = 1000 }) {
  const t = getTransporter();
  if (!t) return { success: false, sent: 0, failed: 0, error: 'Email not configured' };

  let sent = 0;
  let failed = 0;
  const errors = [];

  // Process in batches
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    const promises = batch.map(email =>
      sendEmail({ to: email, subject, html, from })
        .then(r => { if (r.success) sent++; else { failed++; errors.push({ email, error: r.error }); } })
        .catch(e => { failed++; errors.push({ email, error: e.message }); })
    );
    await Promise.all(promises);
    // Small delay between batches to respect Gmail rate limits
    if (i + batchSize < recipients.length) {
      await new Promise(res => setTimeout(res, delayMs));
    }
  }

  console.log(`📧 Email campaign: ${sent} sent, ${failed} failed`);
  return { success: true, sent, failed, errors: errors.slice(0, 10) }; // return first 10 errors max
}

module.exports = { sendEmail, sendBulkEmail };
