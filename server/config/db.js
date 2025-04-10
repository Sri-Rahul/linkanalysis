const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedDatabase = require('./seedData');

let mongoServer;
let retryCount = 0;
const MAX_RETRIES = 5;

/**
 * Connect to MongoDB - with retries and error handling
 */
const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGODB_URI;
    let isMemoryServer = false;

    // For development mode or when DB_MODE is set to memory, try using MongoDB Memory Server
    if ((process.env.NODE_ENV === 'development' && process.env.DB_MODE !== 'regular') || 
        process.env.DB_MODE === 'memory') {
      try {
        console.log('Attempting to use MongoDB Memory Server...');
        mongoServer = await MongoMemoryServer.create({
          instance: {
            dbName: 'linkanalysis',
            args: ['--quiet', '--bind_ip', '127.0.0.1'],
            debug: false
          }
        });
        mongoURI = mongoServer.getUri();
        console.log(`Using MongoDB Memory Server at: ${mongoURI}`);
        isMemoryServer = true;
      } catch (memoryServerError) {
        console.error('Failed to start MongoDB Memory Server:', memoryServerError.message);
        
        // Fallback to localhost MongoDB if memory server fails
        mongoURI = 'mongodb://localhost:27017/linkanalysis';
        console.log(`Falling back to local MongoDB: ${mongoURI}`);
      }
    }

    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      heartbeatFrequencyMS: 5000,     // Check server status every 5 seconds
    };

    const conn = await mongoose.connect(mongoURI, options);
    
    // Reset retry counter on successful connection
    retryCount = 0;
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed database if using memory server or if explicitly requested
    if (isMemoryServer || process.env.SEED_DATABASE === 'true') {
      try {
        await seedDatabase();
        console.log('Database seeded successfully');
      } catch (seedError) {
        console.error('Error seeding database:', seedError.message);
      }
    }
    
    return { connection: conn, isMemoryServer };
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    
    // Implement retry logic
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying connection (${retryCount}/${MAX_RETRIES}) in 3 seconds...`);
      
      // Wait 3 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 3000));
      return connectDB();
    } else {
      console.error('Maximum connection retry attempts reached. Exiting...');
      process.exit(1);
    }
  }
};

/**
 * Disconnect from MongoDB
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    
    if (mongoServer) {
      await mongoServer.stop();
      console.log('MongoDB Memory Server stopped');
    }
    
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

module.exports = { connectDB, disconnectDB, mongoServer };