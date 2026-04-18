const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// ── GET /api/users — Admin: list all users (paginated) ───────────────────────
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// ── PATCH /api/users/:id/role — Admin: change user role ──────────────────────
router.patch('/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "user" or "admin".' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

// ── DELETE /api/users/:id — Admin: remove user ────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

// ── PATCH /api/users/profile — Update own profile ────────────────────────────
router.patch('/profile', protect, async (req, res) => {
  try {
    const { name, savedAreas } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (savedAreas) updates.savedAreas = savedAreas;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

module.exports = router;
