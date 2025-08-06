const mysql = require('mysql2/promise');
require('dotenv').config();

// Test cloud database connection
const testCloudConnection = async () => {
  try {
    console.log('🔍 Testing cloud database connection...');
    
    // Check if DATABASE_URL is provided
    if (!process.env.DATABASE_URL) {
      console.log('❌ DATABASE_URL not found in environment variables');
      process.exit(1);
    }
    
    console.log('🔗 Connecting to:', process.env.DATABASE_URL.replace(/:\/\/.*@/, '://***:***@'));
    
    // Create connection using DATABASE_URL
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    // Test basic query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Database connection successful!');
    console.log('📊 Test query result:', rows[0]);
    
    // Check if tables exist
    const [tables] = await connection.execute("SHOW TABLES");
    console.log('📋 Existing tables:', tables.map(t => Object.values(t)[0]));
    
    // Close connection
    await connection.end();
    console.log('🔌 Connection closed');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('💡 Check your database host URL');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Check your database username and password');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Check your database name');
    }
    
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  testCloudConnection();
}

module.exports = { testCloudConnection };
