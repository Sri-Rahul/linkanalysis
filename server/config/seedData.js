const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Url = require('../models/Url');

/**
 * Seed the database with initial data
 * This includes creating a default user and sample URLs for testing
 */
const seedDatabase = async () => {
  try {
    // Check if the default user already exists
    const userExists = await User.findOne({ email: 'intern@dacoid.com' });
    
    let userId;
    
    if (!userExists) {
      console.log('Seeding database with default user...');
      
      // Create default user - let the User model handle password hashing
      const newUser = await User.create({
        name: 'Test Intern',
        email: 'intern@dacoid.com',
        password: 'Test123' // Plain password - will be hashed by User model middleware
      });
      
      userId = newUser._id;
      console.log('Default user created successfully');
    } else {
      userId = userExists._id;
      console.log('Default user already exists, skipping user seed');
    }
    
    // Check if sample URLs already exist
    const urlExists = await Url.findOne({ originalUrl: 'https://www.example.com' });
    
    if (!urlExists && userId) {
      console.log('Seeding database with sample URLs...');
      
      // Create sample URLs
      await Url.create({
        originalUrl: 'https://www.example.com',
        shortCode: 'example',
        user: userId,
        active: true
      });
      
      await Url.create({
        originalUrl: 'https://www.github.com',
        shortCode: 'github',
        user: userId,
        active: true
      });
      
      console.log('Sample URLs created successfully');
    } else {
      console.log('Sample URLs already exist or user not found, skipping URL seed');
    }
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
  }
};

module.exports = seedDatabase;