const bcrypt = require('bcryptjs');
const { executeQuery } = require('./config/database');

async function seedDatabase() {
  console.log('🌱 Seeding database with demo data...');
  
  try {
    // Create demo user
    const demoPassword = await bcrypt.hash('Demo@1234', 12);
    
    const demoUser = await executeQuery(
      'INSERT IGNORE INTO users (name, email, password, bio) VALUES (?, ?, ?, ?)',
      [
        'Demo User',
        'demo@example.com',
        demoPassword,
        '🚀 Welcome to Mini LinkedIn! I\'m a demo user showcasing this amazing platform. Feel free to explore all the features, create posts, and connect with others. This platform is built with React, Node.js, and MySQL, featuring a beautiful and responsive design that works perfectly on all devices. Join our growing community today!'
      ]
    );

    let demoUserId;
    if (demoUser.insertId) {
      demoUserId = demoUser.insertId;
      console.log('✅ Demo user created successfully');
    } else {
      // User already exists, get their ID
      const existingUser = await executeQuery(
        'SELECT id FROM users WHERE email = ?',
        ['demo@example.com']
      );
      demoUserId = existingUser[0].id;
      console.log('✅ Demo user already exists');
    }

    // Create some sample posts
    const samplePosts = [
      {
        content: `🎉 Welcome to Mini LinkedIn! 

I'm excited to be part of this amazing community platform. This is a full-stack application built with modern technologies:

✅ React 18 with beautiful Tailwind CSS styling
✅ Node.js & Express backend with robust security
✅ MySQL database with optimized queries
✅ JWT authentication for secure access
✅ Responsive design that works on all devices

Feel free to connect with me and explore all the features this platform has to offer! 

#MiniLinkedIn #React #NodeJS #FullStack #WebDevelopment`,
        user_id: demoUserId
      },
      {
        content: `💡 Just finished implementing some amazing features:

🔐 Secure authentication with password strength validation
📱 Mobile-first responsive design
⚡ Real-time post creation and updates
🎨 Beautiful UI with smooth animations
🚀 Fast performance with optimized loading states

The developer experience has been fantastic with Vite and the modern React ecosystem. What are your favorite development tools?

#WebDev #React #ModernWeb #TechStack`,
        user_id: demoUserId
      },
      {
        content: `🌟 Key features that make this platform special:

👥 User profiles with editable bios
📝 Rich text post creation (up to 2000 characters)
💬 Interactive UI with like, comment, and share buttons
🔍 User search and network discovery
📊 Paginated feeds for optimal performance
🛡️ Enterprise-level security practices

Built with love for the developer community! Feel free to register and try it out.

#CommunityBuilding #SocialPlatform #OpenSource`,
        user_id: demoUserId
      }
    ];

    for (const post of samplePosts) {
      await executeQuery(
        'INSERT IGNORE INTO posts (user_id, content) VALUES (?, ?)',
        [post.user_id, post.content]
      );
    }

    console.log('✅ Sample posts created successfully');
    console.log('🎯 Database seeding completed!');
    console.log('');
    console.log('Demo Login Credentials:');
    console.log('📧 Email: demo@example.com');
    console.log('🔑 Password: Demo@1234');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
