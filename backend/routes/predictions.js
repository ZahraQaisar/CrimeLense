const express    = require('express');
const axios      = require('axios');
const { body, validationResult } = require('express-validator');
const { optionalAuth } = require('../middleware/auth');
const Prediction = require('../models/Prediction');

const router     = express.Router();
const FLASK_URL  = process.env.FLASK_URL || 'http://localhost:5000';

// ── Validation ────────────────────────────────────────────────────────────────
const predictionRules = [
  body('latitude').isFloat({ min: -90,  max: 90  }).withMessage('latitude must be -90 to 90'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('longitude must be -180 to 180'),
  body('hour').optional().isInt({ min: 0, max: 23 }),
  body('month').optional().isInt({ min: 1, max: 12 }),
  body('weapon_used').optional().isInt({ min: 0, max: 1 }),
];

// ── POST /api/predictions ─────────────────────────────────────────────────────
router.post('/', optionalAuth, predictionRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { latitude, longitude, hour, month, weapon_used } = req.body;
  const now = new Date();

  const inputs = {
    latitude:    parseFloat(latitude),
    longitude:   parseFloat(longitude),
    hour:        hour  !== undefined ? parseInt(hour)  : now.getHours(),
    month:       month !== undefined ? parseInt(month) : now.getMonth() + 1,
    weapon_used: weapon_used !== undefined ? parseInt(weapon_used) : 0,
  };

  try {
    // Forward request to Flask ML service
    const flaskRes = await axios.post(`${FLASK_URL}/predict/full`, inputs, {
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });

    const result = flaskRes.data;

    // Persist to MongoDB (non-blocking)
    Prediction.create({
      userId:    req.user?._id || null,
      inputs,
      result: {
        risk_score:  result.risk_score,
        binary:      result.binary,
        category:    result.category,
        severity:    result.severity,
        explanation: result.explanation,
      },
      ipAddress: req.ip,
    }).catch(err => console.warn('[Predictions] DB save failed:', err.message));

    return res.json(result);

  } catch (err) {
    // Flask not running or model still loading
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'ML service is not running. Please start the Flask service.',
        hint:  'cd backend/ml-service && python app.py',
      });
    }
    if (err.response?.data?.error) {
      return res.status(err.response.status || 500).json({ error: err.response.data.error });
    }
    console.error('[Predictions] Error:', err.message);
    return res.status(500).json({ error: 'Prediction request failed.' });
  }
});

// ── GET /api/predictions/history ─────────────────────────────────────────────
// Returns last 50 predictions for admin dashboard
router.get('/history', require('../middleware/auth').protect, require('../middleware/auth').adminOnly, async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip  = (page - 1) * limit;

    const [predictions, total] = await Promise.all([
      Prediction.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('userId', 'name email'),
      Prediction.countDocuments(),
    ]);

    res.json({ predictions, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prediction history.' });
  }
});

module.exports = router;
