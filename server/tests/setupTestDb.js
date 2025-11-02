const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function startTestDb() {
  console.log('Starting test database...');
  try {
    // If a MONGO_URI is provided in the environment, use it (useful for CI or local MongoDB)
    if (process.env.MONGO_URI && process.env.MONGO_URI !== '') {
      const uri = process.env.MONGO_URI;
      console.log('Using existing MONGO_URI for tests:', uri);
      if (mongoose.connection.readyState !== 0) {
        console.log('Closing existing connection...');
        await mongoose.disconnect();
      }
      console.log('Connecting mongoose to provided MONGO_URI...');
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000,
      });
      console.log('Connected to existing MongoDB for tests');
      return;
    }

    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
      console.log('Closing existing connection...');
      await mongoose.disconnect();
    }

    console.log('Creating MongoDB Memory Server...');
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log('MongoDB Memory Server URI:', uri);

    // Set environment variable so app code can reuse it if needed
    process.env.MONGO_URI = uri;

    // Connect mongoose
    console.log('Connecting mongoose...');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increase timeouts
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });
    console.log('Connected to test database');
  } catch (error) {
    console.error('Failed to start test DB:', error);
    throw error;
  }
}

async function stopTestDb() {
  console.log('Stopping test database...');
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('Test database stopped');
  } catch (error) {
    console.error('Failed to stop test DB:', error);
    throw error;
  }
}

module.exports = {
  startTestDb,
  stopTestDb,
};
