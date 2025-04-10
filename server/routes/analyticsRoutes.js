const express = require('express');
const router = express.Router();
const {
  getUrlAnalytics,
  getClicksOverTime,
  getDeviceBreakdown,
  getBrowserBreakdown,
  getOsBreakdown,
  getAnalyticsSummary
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected and require authentication
router.use(protect);

// Get summary analytics for all user URLs
router.get('/summary', getAnalyticsSummary);

// Get analytics for a specific URL
router.get('/url/:urlId', getUrlAnalytics);

// Get click statistics over time for a URL
router.get('/url/:urlId/clicks', getClicksOverTime);

// Get device breakdown for a URL
router.get('/url/:urlId/devices', getDeviceBreakdown);

// Get browser breakdown for a URL
router.get('/url/:urlId/browsers', getBrowserBreakdown);

// Get OS breakdown for a URL
router.get('/url/:urlId/os', getOsBreakdown);

module.exports = router;