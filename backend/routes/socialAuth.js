const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'No Google credential provided' });
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const { sub: googleId, email, name, picture, email_verified } = ticket.getPayload();
    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (user) {
      if (!user.googleId) user.googleId = googleId;
      if (!user.photo && picture) user.photo = picture;
      user.authProvider = 'google';
      user.isVerified = email_verified;
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = await User.create({ name, email, googleId, photo: picture || '', authProvider: 'google', isVerified: email_verified, lastLogin: new Date(), password: null });
    }
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, photo: user.photo, authProvider: user.authProvider } });
  } catch (err) {
    res.status(401).json({ message: 'Google authentication failed: ' + err.message });
  }
});

router.post('/facebook', async (req, res) => {
  try {
    const { accessToken, userID } = req.body;
    if (!accessToken || !userID) return res.status(400).json({ message: 'No Facebook token provided' });
    const fbRes = await axios.get(`https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`);
    const { id: facebookId, name, email, picture } = fbRes.data;
    if (!email) return res.status(400).json({ message: 'Facebook account has no email.' });
    let user = await User.findOne({ $or: [{ facebookId }, { email }] });
    if (user) {
      if (!user.facebookId) user.facebookId = facebookId;
      if (!user.photo && picture?.data?.url) user.photo = picture.data.url;
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = await User.create({ name, email, facebookId, photo: picture?.data?.url || '', authProvider: 'facebook', isVerified: true, lastLogin: new Date(), password: null });
    }
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, photo: user.photo, authProvider: user.authProvider } });
  } catch (err) {
    res.status(401).json({ message: 'Facebook authentication failed' });
  }
});

router.post('/github', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'No GitHub code provided' });
    const tokenRes = await axios.post('https://github.com/login/oauth/access_token',
      { client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code },
      { headers: { Accept: 'application/json' } }
    );
    const accessToken = tokenRes.data.access_token;
    if (!accessToken) return res.status(401).json({ message: 'GitHub auth failed' });
    const [userRes, emailsRes] = await Promise.all([
      axios.get('https://api.github.com/user', { headers: { Authorization: `Bearer ${accessToken}` } }),
      axios.get('https://api.github.com/user/emails', { headers: { Authorization: `Bearer ${accessToken}` } })
    ]);
    const ghUser = userRes.data;
    const primaryEmail = emailsRes.data.find(e => e.primary)?.email || emailsRes.data[0]?.email;
    if (!primaryEmail) return res.status(400).json({ message: 'GitHub account has no public email.' });
    let user = await User.findOne({ $or: [{ githubId: String(ghUser.id) }, { email: primaryEmail }] });
    if (user) {
      if (!user.githubId) user.githubId = String(ghUser.id);
      if (!user.photo && ghUser.avatar_url) user.photo = ghUser.avatar_url;
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = await User.create({ name: ghUser.name || ghUser.login, email: primaryEmail, githubId: String(ghUser.id), photo: ghUser.avatar_url || '', authProvider: 'github', isVerified: true, lastLogin: new Date(), password: null });
    }
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, photo: user.photo, authProvider: user.authProvider } });
  } catch (err) {
    res.status(401).json({ message: 'GitHub authentication failed' });
  }
});

module.exports = router;
