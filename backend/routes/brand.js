const router = require('express').Router();
const Brand = require('../models/Brand');
const { adminOnly } = require('../middleware/auth');

// GET all brand settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await Brand.find();
    const result = {};
    settings.forEach(s => result[s.key] = s.value);
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single setting
router.get('/:key', async (req, res) => {
  try {
    const setting = await Brand.findOne({ key: req.params.key });
    if (!setting) return res.status(404).json({ message: 'Not found' });
    res.json(setting.value);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update setting (admin)
router.put('/:key', adminOnly, async (req, res) => {
  try {
    const setting = await Brand.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
