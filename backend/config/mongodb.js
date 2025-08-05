const mongoose = require('mongoose');

// MongoDB connection configuration
const connectDatabase = async () => {
  try {
    // Use MONGODB_URI or fallback to local MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/community_platform';
    
    console.log('🔍 Connecting to MongoDB...');
    
    const conn = await mongoose.connect(mongoUri);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
};

// Test MongoDB connection
const testMongoConnection = async () => {
  try {
    const isConnected = await connectDatabase();
    if (isConnected) {
      console.log('✅ MongoDB connection test successful');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error.message);
    return false;
  }
};

// Close MongoDB connection
const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
  }
};

module.exports = {
  connectDatabase,
  testMongoConnection,
  closeDatabase,
  mongoose
};
