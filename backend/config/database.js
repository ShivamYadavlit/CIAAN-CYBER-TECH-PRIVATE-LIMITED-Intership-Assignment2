const mysql = require('mysql2/promise');

// Parse DATABASE_URL if provided (for cloud deployments like Render)
const parseDatabaseUrl = (url) => {
  if (!url) return null;
  
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parsed.port || 3306,
      user: parsed.username,
      password: parsed.password,
      database: parsed.pathname.substring(1), // Remove leading slash
    };
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error);
    return null;
  }
};

// Database configuration with cloud support
const dbConfig = (() => {
  // If DATABASE_URL is provided (cloud deployment), use it
  if (process.env.DATABASE_URL) {
    const parsed = parseDatabaseUrl(process.env.DATABASE_URL);
    if (parsed) {
      return {
        ...parsed,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4',
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true
      };
    }
  }
  
  // Fallback to individual environment variables (local development)
  return {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'shivam@543',
    database: process.env.DB_NAME || 'community_platform2',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
})();

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Create database if it doesn't exist (mainly for local development)
const createDatabase = async () => {
  try {
    // Skip database creation if using DATABASE_URL (cloud deployment)
    if (process.env.DATABASE_URL) {
      console.log('✅ Using cloud database from DATABASE_URL');
      return true;
    }
    
    // Connect without specifying database
    const tempConfig = { ...dbConfig };
    delete tempConfig.database;
    const tempPool = mysql.createPool(tempConfig);
    
    const connection = await tempPool.getConnection();
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.log(`✅ Database '${dbConfig.database}' created or already exists`);
    connection.release();
    await tempPool.end();
    return true;
  } catch (error) {
    console.error('❌ Database creation failed:', error.message);
    return false;
  }
};

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        bio TEXT,
        avatar_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create posts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Database tables initialized successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

// Execute query with error handling
const executeQuery = async (query, params = []) => {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  createDatabase,
  testConnection,
  initializeDatabase,
  executeQuery
};
