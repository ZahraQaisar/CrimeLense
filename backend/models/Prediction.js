const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  inputs: {
    latitude:    { type: Number, required: true },
    longitude:   { type: Number, required: true },
    hour:        { type: Number, required: true },
    month:       { type: Number, required: true },
    weapon_used: { type: Number, default: 0 },
  },
  result: {
    risk_score:  Number,
    binary:      mongoose.Schema.Types.Mixed,
    category:    mongoose.Schema.Types.Mixed,
    severity:    mongoose.Schema.Types.Mixed,
    explanation: String,
  },
  ipAddress:  { type: String },
  createdAt:  { type: Date, default: Date.now, expires: 86400 }, // TTL: 24 hours
});

module.exports = mongoose.model('Prediction', predictionSchema);
