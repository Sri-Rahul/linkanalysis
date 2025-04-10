const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const UrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, 'Please provide the original URL'],
    trim: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customAlias: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Made user optional to allow guest URL creation
  },
  clicks: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate a short code before saving if not provided as custom alias
UrlSchema.pre('save', async function(next) {
  if (this.isNew && !this.shortCode) {
    // If custom alias is provided, use it as the short code
    if (this.customAlias) {
      this.shortCode = this.customAlias;
    } else {
      // Generate a unique short code
      let isUnique = false;
      let shortCode;
      
      while (!isUnique) {
        // Generate a 6-character code
        shortCode = nanoid(6);
        
        // Check if the code already exists
        const existingUrl = await this.constructor.findOne({ shortCode });
        
        if (!existingUrl) {
          isUnique = true;
        }
      }
      
      this.shortCode = shortCode;
    }
  }
  
  next();
});

module.exports = mongoose.model('Url', UrlSchema);