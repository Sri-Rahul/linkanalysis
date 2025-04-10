const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  url: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    trim: true
  },
  device: {
    type: String,
    trim: true
  },
  browser: {
    type: String,
    trim: true
  },
  os: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  referrer: {
    type: String,
    trim: true
  }
});

// Create indexes for better query performance
AnalyticsSchema.index({ url: 1, timestamp: 1 });
AnalyticsSchema.index({ device: 1 });
AnalyticsSchema.index({ browser: 1 });
AnalyticsSchema.index({ country: 1 });

module.exports = mongoose.model('Analytics', AnalyticsSchema);