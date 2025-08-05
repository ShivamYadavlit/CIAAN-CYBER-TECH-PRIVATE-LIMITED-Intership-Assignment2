const { testConnection, initializeDatabase } = require('./config/database');

async function setupDatabase() {
  console.log('🔄 Setting up database...');
  
  try {
    // Test connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.log('❌ Database connection failed. Please check your configuration.');
      process.exit(1);
    }

    // Initialize tables
    await initializeDatabase();
    
    console.log('✅ Database setup completed successfully!');
    console.log('🚀 You can now start the server with: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
