const router = require('express').Router();
const Project = require('../models/Project');
const { adminOnly } = require('../middleware/auth');

// GET all active projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true }).sort({ order: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single project by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(404).json({ message: 'Project not found' });
  }
});

// POST create project (admin)
router.post('/', adminOnly, async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, updatedAt: new Date() });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update project (admin)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE project (admin)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
