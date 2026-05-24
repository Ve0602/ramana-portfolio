const router = require('express').Router();
const Campaign = require('../models/Campaign');
const NotifSettings = require('../models/NotifSettings');
const User = require('../models/User');
const { adminOnly } = require('../middleware/auth');
const { sendBulkEmail, sendEmail } = require('../utils/emailSender');
const templates = require('../utils/emailTemplates');

// Helper: get brand settings
const getBrand = async () => {
  try {
    const Brand = require('../models/Brand');
    const b = await Brand.findOne({ key: 'site' });
    return b?.value || {};
  } catch { return {}; }
};

// Helper: get all user emails who have not unsubscribed
const getRecipients = async () => {
  const users = await User.find({ role: 'user' }).select('email name');
  return users.filter(u => u.email);
};

// ── GET all campaigns (admin) ───────────────────────────────
router.get('/campaigns', adminOnly, async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── GET notification settings ───────────────────────────────
router.get('/settings', adminOnly, async (req, res) => {
  try {
    const settings = await NotifSettings.find();
    const result = {};
    settings.forEach(s => result[s.key] = s.value);
    // Defaults
    if (!result.autoNotifyProduct)  result.autoNotifyProduct  = true;
    if (!result.autoNotifyService)  result.autoNotifyService  = true;
    if (!result.autoNotifyReferral) result.autoNotifyReferral = true;
    if (!result.autoNotifyFreelance) result.autoNotifyFreelance = true;
    if (!result.welcomeEmail)       result.welcomeEmail       = true;
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── UPDATE notification settings ───────────────────────────
router.put('/settings', adminOnly, async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await NotifSettings.findOneAndUpdate({ key }, { value }, { upsert: true });
    }
    res.json({ message: 'Settings saved' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── SEND CAMPAIGN (admin) ───────────────────────────────────
router.post('/send', adminOnly, async (req, res) => {
  try {
    const { title, subject, template, templateData, testEmail } = req.body;
    const brand = await getBrand();
    const brandColor = brand.primaryColor || '#d4a853';
    const brandName  = brand.name || 'Vemunoori Collections';

    // Build HTML from template
    const html = templates[template] ? templates[template]({ ...templateData, brandColor, brandName }) : templates.general({ subject, message: templateData.message || '', brandColor, brandName });

    // Test mode — send to one email only
    if (testEmail) {
      const result = await sendEmail({ to: testEmail, subject, html });
      return res.json({ message: result.success ? `✅ Test email sent to ${testEmail}` : `❌ Failed: ${result.error}`, test: true });
    }

    // Full send
    const recipients = await getRecipients();
    const emails = recipients.map(u => u.email);

    if (emails.length === 0) return res.json({ message: 'No users to send to yet.', sent: 0 });

    // Save campaign as sending
    const campaign = await Campaign.create({ title, subject, body: html, template, templateData, status: 'draft' });

    // Send in background — don't block the response
    res.json({ message: `📧 Sending to ${emails.length} users...`, campaignId: campaign._id, total: emails.length });

    // Send emails
    const result = await sendBulkEmail({ recipients: emails, subject, html });
    await Campaign.findByIdAndUpdate(campaign._id, { status: result.sent > 0 ? 'sent' : 'failed', sentTo: result.sent, sentAt: new Date() });
    console.log(`Campaign "${title}": ${result.sent} sent, ${result.failed} failed`);

  } catch (err) {
    console.error('Send campaign error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ── AUTO NOTIFY — called internally when product/service/referral added ──
router.post('/auto', adminOnly, async (req, res) => {
  try {
    const { triggerType, data } = req.body;
    const brand = await getBrand();
    const brandColor = brand.primaryColor || '#d4a853';
    const brandName  = brand.name || 'Vemunoori Collections';

    // Check if auto-notify is enabled for this type
    const setting = await NotifSettings.findOne({ key: `autoNotify${triggerType.charAt(0).toUpperCase() + triggerType.slice(1)}` });
    if (setting && setting.value === false) return res.json({ message: 'Auto-notify disabled for this type' });

    let subject = '', html = '';

    if (triggerType === 'product') {
      subject = `✨ New Arrival: ${data.name} — ${brandName}`;
      html = templates.product({ productName: data.name, productDesc: data.description || '', price: data.price || '', category: data.category || '', imageUrl: data.images?.[0] || '', brandColor, brandName });
    } else if (triggerType === 'referral') {
      subject = `💼 New Job Opportunity: ${data.platform} — ${brandName}`;
      html = templates.referral({ platform: data.platform, description: data.description || '', perks: data.perks || [], brandColor, brandName });
    } else if (triggerType === 'service') {
      subject = `🚀 New Service: ${data.title} — ${brandName}`;
      html = templates.general({ subject: data.title, message: data.description || '', ctaText: 'Explore Service', ctaLink: 'https://ramana-portfolio-one.vercel.app/home', brandColor, brandName });
    } else if (triggerType === 'freelance') {
      subject = `🎯 New Freelance Service: ${data.title} — ${brandName}`;
      html = templates.freelance({ serviceTitle: data.title, serviceDesc: data.description || '', price: data.price || '', brandColor, brandName });
    }

    const recipients = await getRecipients();
    const emails = recipients.map(u => u.email);
    if (emails.length === 0) return res.json({ message: 'No users to notify', sent: 0 });

    // Save and send
    const campaign = await Campaign.create({ title: subject, subject, body: html, template: triggerType, templateData: data, autoTriggered: true, triggerType, status: 'draft' });

    res.json({ message: `Auto-notifying ${emails.length} users...` });

    const result = await sendBulkEmail({ recipients: emails, subject, html });
    await Campaign.findByIdAndUpdate(campaign._id, { status: result.sent > 0 ? 'sent' : 'failed', sentTo: result.sent, sentAt: new Date() });

  } catch (err) {
    console.error('Auto-notify error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ── SEND WELCOME EMAIL (called on new user registration) ────
router.post('/welcome', async (req, res) => {
  try {
    const { userName, userEmail } = req.body;
    if (!userEmail) return res.status(400).json({ message: 'No email' });

    const welcomeSetting = await NotifSettings.findOne({ key: 'welcomeEmail' });
    if (welcomeSetting && welcomeSetting.value === false) return res.json({ message: 'Welcome email disabled' });

    const brand = await getBrand();
    const brandColor = brand.primaryColor || '#d4a853';
    const brandName  = brand.name || 'Vemunoori Collections';

    const html = templates.welcome({ userName: userName || 'there', brandColor, brandName });
    await sendEmail({ to: userEmail, subject: `Welcome to ${brandName}! 🎉`, html });
    res.json({ message: 'Welcome email sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE campaign ─────────────────────────────────────────
router.delete('/campaigns/:id', adminOnly, async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
