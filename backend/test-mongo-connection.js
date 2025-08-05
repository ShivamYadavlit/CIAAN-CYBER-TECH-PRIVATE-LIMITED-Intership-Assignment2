const mongoose = require('mongoose');
require('dotenv').config();

// Test MongoDB connection
const testMongoConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    // Check if MONGODB_URI is provided
    if (!process.env.MONGODB_URI && !process.env.DATABASE_URL) {
      console.log('❌ MONGODB_URI or DATABASE_URL not found in environment variables');
      console.log('💡 Add one of these to your .env file:');
      console.log('   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname');
      console.log('   DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname');
      process.exit(1);
    }
    
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL;
    console.log('🔗 Connecting to:', mongoUri.replace(/:\/\/.*@/, '://***:***@'));
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB connection successful!');
    console.log('📊 Connected to database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('📍 Ready state:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name).join(', ') || 'None (will be created on first use)');
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('💡 Check your username and password in the connection string');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('💡 Check your cluster URL and network connection');
    } else if (error.message.includes('IP address') || error.message.includes('not in whitelist')) {
      console.log('💡 Add your IP address to MongoDB Atlas Network Access');
      console.log('   Or allow access from anywhere (0.0.0.0/0) for cloud deployment');
    }
    
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  testMongoConnection();
}

module.exports = { testMongoConnection };
