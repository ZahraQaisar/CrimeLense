const express   = require('express');
const axios     = require('axios');
const router    = express.Router();
const FLASK_URL = process.env.FLASK_URL || 'http://localhost:5000';

// ── GET /api/hotspots ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const params = req.query.tier ? `?tier=${req.query.tier}` : '';
    const { data } = await axios.get(`${FLASK_URL}/hotspots${params}`, { timeout: 10000 });
    res.json(data);
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'ML service unavailable.' });
    }
    res.status(500).json({ error: 'Failed to fetch hotspot data.' });
  }
});

// ── GET /api/hotspots/area-profiles ──────────────────────────────────────────
router.get('/area-profiles', async (req, res) => {
  try {
    const { data } = await axios.get(`${FLASK_URL}/area-profiles`, { timeout: 10000 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch area profiles.' });
  }
});

// ── GET /api/hotspots/trends/hourly ──────────────────────────────────────────
router.get('/trends/hourly', async (req, res) => {
  try {
    const { data } = await axios.get(`${FLASK_URL}/trends/hourly`, { timeout: 10000 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hourly trends.' });
  }
});

// ── GET /api/hotspots/trends/monthly ─────────────────────────────────────────
router.get('/trends/monthly', async (req, res) => {
  try {
    const { data } = await axios.get(`${FLASK_URL}/trends/monthly`, { timeout: 10000 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch monthly trends.' });
  }
});

// ── GET /api/hotspots/metadata ────────────────────────────────────────────────
router.get('/metadata', async (req, res) => {
  try {
    const { data } = await axios.get(`${FLASK_URL}/metadata`, { timeout: 10000 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch model metadata.' });
  }
});

module.exports = router;
