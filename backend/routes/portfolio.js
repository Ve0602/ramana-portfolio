const router = require('express').Router();
const Portfolio = require('../models/Portfolio');
const { adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const sections = await Portfolio.find();
    const result = {};
    sections.forEach(s => result[s.section] = s.data);
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:section', async (req, res) => {
  try {
    const section = await Portfolio.findOne({ section: req.params.section });
    if (!section) return res.status(404).json({ message: 'Section not found' });
    res.json(section.data);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:section', adminOnly, async (req, res) => {
  try {
    const section = await Portfolio.findOneAndUpdate(
      { section: req.params.section },
      { data: req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(section);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
