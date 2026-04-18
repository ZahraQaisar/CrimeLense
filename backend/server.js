require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');
const mongoose     = require('mongoose');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Security & middleware ─────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { error: 'Too many requests. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders:   false,
});
const predLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  message: { error: 'Prediction limit reached (50/hour). Please try later.' },
});

app.use(globalLimiter);

// ── MongoDB ───────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crimelense')
  .then(async () => {
    console.log('[CrimeLense] MongoDB connected ✓');
    
    // Seed Admin User
    try {
      const User = require('./models/User');
      const adminEmail = 'admin@gmail.com';
      const adminExists = await User.findOne({ email: adminEmail });
      
      if (!adminExists) {
        await User.create({
          name: 'System Admin',
          email: adminEmail,
          passwordHash: 'admin123',
          role: 'admin'
        });
        console.log(`[CrimeLense] Admin user seeded: ${adminEmail}`);
      } else if (adminExists.role !== 'admin') {
        adminExists.role = 'admin';
        // Note: setting passwordHash is not strictly required here if they just wanted to update role, but let's ensure password is admin123 too.
        adminExists.passwordHash = 'admin123'; 
        await adminExists.save();
        console.log(`[CrimeLense] Updated existing user ${adminEmail} to admin role`);
      }
    } catch (e) {
      console.warn('[CrimeLense] Failed to seed admin user:', e.message);
    }
  })
  .catch(err => {
    console.warn('[CrimeLense] MongoDB connection failed:', err.message);
    console.warn('[CrimeLense] Running without database — auth features disabled.');
  });

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/predictions', predLimiter, require('./routes/predictions'));
app.use('/api/hotspots',    require('./routes/hotspots'));
app.use('/api/users',       require('./routes/users'));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status:   'ok',
    service:  'CrimeLense Node API',
    db:       mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime:   Math.floor(process.uptime()),
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[CrimeLense] Unhandled error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[CrimeLense] Node API running on http://localhost:${PORT} ✓`);
  console.log(`[CrimeLense] Flask ML service expected at ${process.env.FLASK_URL || 'http://localhost:5000'}`);
});

module.exports = app;
