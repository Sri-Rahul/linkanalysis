const express = require('express');
const router = express.Router();
const { createUrl, getUrls, getUrlById, updateUrl, deleteUrl } = require('../controllers/urlController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

// Create a new shortened URL - this can be done with or without authentication
router.post('/', optionalProtect, createUrl);

// These routes require authentication
router.get('/', protect, getUrls);

// Get, update, or delete a specific URL by ID - requires authentication
router.route('/:id')
  .get(protect, getUrlById)
  .put(protect, updateUrl)
  .delete(protect, deleteUrl);

module.exports = router;