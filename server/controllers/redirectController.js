const asyncHandler = require('express-async-handler');
const UAParser = require('ua-parser-js');
const Url = require('../models/Url');
const Analytics = require('../models/Analytics');

/**
 * @desc    Redirect to original URL and track analytics
 * @route   GET /:code
 * @access  Public
 */
const redirectToUrl = asyncHandler(async (req, res) => {
  const { code } = req.params;
  console.log(`Redirect attempt for code: ${code}`);

  // Find the URL by short code
  const url = await Url.findOne({ shortCode: code });
  
  if (!url) {
    // Instead of throwing an error, render a nice 404 page or redirect to frontend
    if (process.env.NODE_ENV === 'production') {
      return res.redirect(`${process.env.BASE_URL}/not-found?code=${code}`);
    }
    res.status(404).json({ error: 'URL not found' });
    return;
  }

  // Check if URL is active and not expired
  if (!url.active) {
    res.status(410);
    throw new Error('This link has been deactivated');
  }

  if (url.expiresAt && url.expiresAt < new Date()) {
    res.status(410);
    throw new Error('This link has expired');
  }

  // Increment click count
  url.clicks += 1;
  await url.save();

  // Track analytics asynchronously (don't wait for it to complete)
  const trackAnalytics = async () => {
    try {
      // Parse user agent
      const parser = new UAParser(req.headers['user-agent']);
      const userAgentData = parser.getResult();

      // Create analytics entry
      await Analytics.create({
        url: url._id,
        ipAddress: req.ip || req.connection.remoteAddress,
        device: userAgentData.device.type || 'unknown',
        browser: userAgentData.browser.name || 'unknown',
        os: userAgentData.os.name || 'unknown',
        referrer: req.headers.referer || 'direct',
        // Note: For production, you might want to use a geolocation service
        // to get country and city information based on IP
        country: 'unknown',
        city: 'unknown'
      });
    } catch (error) {
      console.error('Error tracking analytics:', error);
      // Don't throw the error as this is an async operation
      // that shouldn't affect the redirect
    }
  };

  // Start analytics tracking without waiting
  trackAnalytics();

  // Redirect to the original URL
  res.redirect(url.originalUrl);
});

module.exports = redirectToUrl;