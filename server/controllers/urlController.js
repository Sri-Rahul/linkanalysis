const asyncHandler = require('express-async-handler');
const Url = require('../models/Url');
const crypto = require('crypto');

/**
 * @desc    Create a new shortened URL
 * @route   POST /api/urls
 * @access  Public/Private (works with or without authentication)
 */
const createUrl = asyncHandler(async (req, res) => {
  const { originalUrl, customAlias, expiresAt } = req.body;

  if (!originalUrl) {
    res.status(400);
    throw new Error('Please provide the original URL');
  }

  // Generate shortCode or use customAlias
  const shortCode = customAlias || generateRandomCode();

  // Check if custom alias or generated shortCode is already in use
  const existingUrl = await Url.findOne({ shortCode });
  if (existingUrl) {
    res.status(400);
    throw new Error(customAlias ? 'Custom alias is already in use' : 'Generated code is already in use. Please try again.');
  }

  // Create URL object
  const urlData = {
    originalUrl,
    shortCode, // Always include the shortCode (custom or generated)
    expiresAt: expiresAt || null,
  };

  // Associate with user if authenticated
  if (req.user) {
    urlData.user = req.user._id;
  }

  try {
    const url = await Url.create(urlData);
    res.status(201).json(url);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

/**
 * Generate a random short code (6 characters)
 */
const generateRandomCode = () => {
  return crypto.randomBytes(3).toString('hex');
};

/**
 * @desc    Get all URLs for the authenticated user
 * @route   GET /api/urls
 * @access  Private
 */
const getUrls = asyncHandler(async (req, res) => {
  const urls = await Url.find({ user: req.user._id }).sort({ createdAt: -1 });

  const formattedUrls = urls.map(url => ({
    _id: url._id,
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
    shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
    customAlias: url.customAlias,
    expiresAt: url.expiresAt,
    clicks: url.clicks,
    active: url.active,
    createdAt: url.createdAt,
  }));

  res.json(formattedUrls);
});

/**
 * @desc    Get a specific URL by ID
 * @route   GET /api/urls/:id
 * @access  Private
 */
const getUrlById = asyncHandler(async (req, res) => {
  const url = await Url.findById(req.params.id);

  if (!url) {
    res.status(404);
    throw new Error('URL not found');
  }

  // Check if the URL belongs to the authenticated user
  if (url.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this URL');
  }

  res.json({
    _id: url._id,
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
    shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
    customAlias: url.customAlias,
    expiresAt: url.expiresAt,
    clicks: url.clicks,
    active: url.active,
    createdAt: url.createdAt,
  });
});

/**
 * @desc    Update a URL
 * @route   PUT /api/urls/:id
 * @access  Private
 */
const updateUrl = asyncHandler(async (req, res) => {
  const { active, expiresAt } = req.body;
  
  const url = await Url.findById(req.params.id);

  if (!url) {
    res.status(404);
    throw new Error('URL not found');
  }

  // Check if the URL belongs to the authenticated user
  if (url.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this URL');
  }

  // Update fields
  if (active !== undefined) url.active = active;
  if (expiresAt) url.expiresAt = new Date(expiresAt);

  const updatedUrl = await url.save();

  res.json({
    _id: updatedUrl._id,
    originalUrl: updatedUrl.originalUrl,
    shortCode: updatedUrl.shortCode,
    shortUrl: `${process.env.BASE_URL}/${updatedUrl.shortCode}`,
    customAlias: updatedUrl.customAlias,
    expiresAt: updatedUrl.expiresAt,
    clicks: updatedUrl.clicks,
    active: updatedUrl.active,
    createdAt: updatedUrl.createdAt,
  });
});

/**
 * @desc    Delete a URL
 * @route   DELETE /api/urls/:id
 * @access  Private
 */
const deleteUrl = asyncHandler(async (req, res) => {
  const url = await Url.findById(req.params.id);

  if (!url) {
    res.status(404);
    throw new Error('URL not found');
  }

  // Check if the URL belongs to the authenticated user
  if (url.user && url.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this URL');
  }

  // Replace url.remove() with Url.deleteOne() or findByIdAndDelete
  await Url.deleteOne({ _id: req.params.id });

  res.json({ id: req.params.id, message: 'URL removed' });
});

module.exports = {
  createUrl,
  getUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
};