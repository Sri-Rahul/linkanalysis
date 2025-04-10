const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Connect to MongoDB in-memory database for development
 */
const connectMemoryDB = async () => {
  try {
    // Create a new MongoDB in-memory server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    console.log(`Using MongoDB Memory Server at: ${mongoUri}`);
    
    // Connect to the in-memory database
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Memory Server Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB Memory Server: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Stop the MongoDB in-memory server
 */
const stopMemoryDB = async () => {
  if (mongoServer) {
    await mongoose.connection.close();
    await mongoServer.stop();
    console.log('MongoDB Memory Server stopped');
  }
};

module.exports = { connectMemoryDB, stopMemoryDB };