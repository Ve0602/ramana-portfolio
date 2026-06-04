const router = require('express').Router();
const Campaign = require('../models/Campaign');
const NotifSettings = require('../models/NotifSettings');
const User = require('../models/User');
const { adminOnly } = require('../middleware/auth');

const getBrand = async () => {
  try {
    const Brand = require('../models/Brand');
    const b = await Brand.findOne({ key: 'site' });
    return b?.value || {};
  } catch { return {}; }
};

const getRecipients = async () => {
  const users = await User.find({ role: 'user' }).select('email name');
  return users.filter(u => u.email);
};

const getEmailSender = () => {
  try { return require('../utils/emailSender'); }
  catch { return null; }
};

const getTemplates = () => {
  try { return require('../utils/emailTemplates'); }
  catch { return null; }
};

router.get('/campaigns', adminOnly, async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/settings', adminOnly, async (req, res) => {
  try {
    const settings = await NotifSettings.find();
    const result = {};
    settings.forEach(s => result[s.key] = s.value);
    if (!result.autoNotifyProduct)   result.autoNotifyProduct = true;
    if (!result.autoNotifyService)   result.autoNotifyService = true;
    if (!result.autoNotifyReferral)  result.autoNotifyReferral = true;
    if (!result.welcomeEmail)        result.welcomeEmail = true;
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/settings', adminOnly, async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await NotifSettings.findOneAndUpdate({ key }, { value }, { upsert: true });
    }
    res.json({ message: 'Settings saved' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/send', adminOnly, async (req, res) => {
  try {
    const { title, subject, template, templateData, testEmail } = req.body;
    const brand = await getBrand();
    const brandColor = brand.primaryColor || '#d4a853';
    const brandName  = brand.name || 'Vemunoori Collections';
    const templates = getTemplates();
    const { sendEmail, sendBulkEmail } = getEmailSender() || {};

    if (!sendEmail) return res.json({ message: '⚠️ Email not configured. Add GMAIL_USER and GMAIL_APP_PASSWORD to Render environment.' });

    const html = templates && templates[template]
      ? templates[template]({ ...templateData, brandColor, brandName })
      : `<div style="font-family:Arial;padding:20px;"><h2 style="color:${brandColor}">${subject}</h2><p>${templateData?.message || ''}</p></div>`;

    if (testEmail) {
      const result = await sendEmail({ to: testEmail, subject, html });
      return res.json({ message: result.success ? `✅ Test email sent to ${testEmail}` : `❌ Failed: ${result.error}`, test: true });
    }

    const recipients = await getRecipients();
    const emails = recipients.map(u => u.email);
    if (emails.length === 0) return res.json({ message: 'No users to send to yet.', sent: 0 });

    const campaign = await Campaign.create({ title, subject, body: html, template, templateData, status: 'draft' });
    res.json({ message: `📧 Sending to ${emails.length} users...`, campaignId: campaign._id, total: emails.length });

    const result = await sendBulkEmail({ recipients: emails, subject, html });
    await Campaign.findByIdAndUpdate(campaign._id, { status: result.sent > 0 ? 'sent' : 'failed', sentTo: result.sent, sentAt: new Date() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/welcome', async (req, res) => {
  try {
    const { userName, userEmail } = req.body;
    if (!userEmail) return res.status(400).json({ message: 'No email' });
    const setting = await NotifSettings.findOne({ key: 'welcomeEmail' });
    if (setting && setting.value === false) return res.json({ message: 'Welcome email disabled' });
    const brand = await getBrand();
    const sender = getEmailSender();
    if (!sender) return res.json({ message: 'Email not configured' });
    const templates = getTemplates();
    const html = templates?.welcome
      ? templates.welcome({ userName: userName || 'there', brandColor: brand.primaryColor || '#d4a853', brandName: brand.name || 'Vemunoori Collections' })
      : `<div style="font-family:Arial;padding:20px;"><h2>Welcome to ${brand.name || 'Vemunoori Collections'}, ${userName}!</h2></div>`;
    await sender.sendEmail({ to: userEmail, subject: `Welcome to ${brand.name || 'Vemunoori Collections'}! 🎉`, html });
    res.json({ message: 'Welcome email sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/campaigns/:id', adminOnly, async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
