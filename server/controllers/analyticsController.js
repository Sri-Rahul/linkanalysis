const asyncHandler = require('express-async-handler');
const Analytics = require('../models/Analytics');
const Url = require('../models/Url');
const mongoose = require('mongoose');

/**
 * @desc    Get analytics for a specific URL
 * @route   GET /api/analytics/url/:urlId
 * @access  Private
 */
const getUrlAnalytics = asyncHandler(async (req, res) => {
  const { urlId } = req.params;
  
  // Check if URL exists and belongs to the user
  const url = await Url.findById(urlId);
  
  if (!url) {
    res.status(404);
    throw new Error('URL not found');
  }
  
  if (url.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this URL\'s analytics');
  }
  
  // Get all analytics entries for this URL
  const analytics = await Analytics.find({ url: urlId });
  
  res.json(analytics);
});

/**
 * @desc    Get click statistics over time for a URL
 * @route   GET /api/analytics/url/:urlId/clicks
 * @access  Private
 */
const getClicksOverTime = asyncHandler(async (req, res) => {
  const { urlId } = req.params;
  const { timeframe } = req.query; // day, week, month, year
  
  // Check if URL exists and belongs to the user
  const url = await Url.findById(urlId);
  
  if (!url) {
    res.status(404);
    throw new Error('URL not found');
  }
  
  if (url.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this URL\'s analytics');
  }
  
  // Set time range based on timeframe
  let startDate = new Date();
  switch (timeframe) {
    case 'day':
      startDate.setDate(startDate.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      // Default to last 30 days
      startDate.setDate(startDate.getDate() - 30);
  }
  
  // Group analytics by day and count clicks
  const clicksOverTime = await Analytics.aggregate([
    {
      $match: {
        url: new mongoose.Types.ObjectId(urlId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$timestamp" },
          month: { $month: "$timestamp" },
          day: { $dayOfMonth: "$timestamp" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day"
          }
        },
        clicks: "$count"
      }
    }
  ]);
  
  res.json(clicksOverTime);
});

/**
 * @desc    Get device breakdown for a URL
 * @route   GET /api/analytics/url/:urlId/devices
 * @access  Private
 */
const getDeviceBreakdown = asyncHandler(async (req, res) => {
  const { urlId } = req.params;
  
  // Check if URL exists and belongs to the user
  const url = await Url.findById(urlId);
  
  if (!url) {
    res.status(404);
    throw new Error('URL not found');
  }
  
  if (url.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this URL\'s analytics');
  }
  
  // Group analytics by device and count
  const deviceBreakdown = await Analytics.aggregate([
    {
      $match: { url: new mongoose.Types.ObjectId(urlId) }
    },
    {
      $group: {
        _id: "$device",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        device: "$_id",
        count: 1
      }
    }
  ]);
  
  res.json(deviceBreakdown);
});

/**
 * @desc    Get browser breakdown for a URL
 * @route   GET /api/analytics/url/:urlId/browsers
 * @access  Private
 */
const getBrowserBreakdown = asyncHandler(async (req, res) => {
  const { urlId } = req.params;
  
  // Check if URL exists and belongs to the user
  const url = await Url.findById(urlId);
  
  if (!url) {
    res.status(404);
    throw new Error('URL not found');
  }
  
  if (url.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this URL\'s analytics');
  }
  
  // Group analytics by browser and count
  const browserBreakdown = await Analytics.aggregate([
    {
      $match: { url: new mongoose.Types.ObjectId(urlId) }
    },
    {
      $group: {
        _id: "$browser",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        browser: "$_id",
        count: 1
      }
    }
  ]);
  
  res.json(browserBreakdown);
});

/**
 * @desc    Get OS breakdown for a URL
 * @route   GET /api/analytics/url/:urlId/os
 * @access  Private
 */
const getOsBreakdown = asyncHandler(async (req, res) => {
  const { urlId } = req.params;
  
  // Check if URL exists and belongs to the user
  const url = await Url.findById(urlId);
  
  if (!url) {
    res.status(404);
    throw new Error('URL not found');
  }
  
  if (url.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this URL\'s analytics');
  }
  
  // Group analytics by OS and count
  const osBreakdown = await Analytics.aggregate([
    {
      $match: { url: new mongoose.Types.ObjectId(urlId) }
    },
    {
      $group: {
        _id: "$os",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        os: "$_id",
        count: 1
      }
    }
  ]);
  
  res.json(osBreakdown);
});

/**
 * @desc    Get summary analytics for all user URLs
 * @route   GET /api/analytics/summary
 * @access  Private
 */
const getAnalyticsSummary = asyncHandler(async (req, res) => {
  // Get all URLs for the user
  const userUrls = await Url.find({ user: req.user._id });
  const urlIds = userUrls.map(url => url._id);
  
  // Get total clicks across all URLs
  const totalClicks = userUrls.reduce((sum, url) => sum + url.clicks, 0);
  
  // Get top performing URLs
  const topUrls = userUrls
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)
    .map(url => ({
      _id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      clicks: url.clicks
    }));
  
  // Get recent analytics
  const recentAnalytics = await Analytics.find({ url: { $in: urlIds } })
    .sort({ timestamp: -1 })
    .limit(10);
  
  // Get device breakdown across all URLs
  const deviceBreakdown = await Analytics.aggregate([
    {
      $match: { url: { $in: urlIds.map(id => new mongoose.Types.ObjectId(id)) } }
    },
    {
      $group: {
        _id: "$device",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        device: "$_id",
        count: 1
      }
    }
  ]);
  
  res.json({
    totalUrls: userUrls.length,
    totalClicks,
    topUrls,
    recentAnalytics,
    deviceBreakdown
  });
});

module.exports = {
  getUrlAnalytics,
  getClicksOverTime,
  getDeviceBreakdown,
  getBrowserBreakdown,
  getOsBreakdown,
  getAnalyticsSummary
};