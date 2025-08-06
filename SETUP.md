# MiniLinkedIn - Community Platform

A full-stack social media platform similar to LinkedIn, built for professional networking and community engagement.

## 🛠️ Technology Stack

### **Frontend**
- **React** (v18.x) - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Router DOM** - Client-side routing for single-page application
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library
- **PostCSS** - CSS post-processor

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MySQL** - Relational database management system
- **JWT (jsonwebtoken)** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing library
- **express-validator** - Server-side validation middleware
- **cors** - Cross-Origin Resource Sharing middleware
- **helmet** - Security middleware for Express
- **morgan** - HTTP request logger
- **express-rate-limit** - Rate limiting middleware
- **dotenv** - Environment variable management
- **nodemon** - Development server with auto-restart

### **Database**
- **MySQL 2** - Promise-based MySQL client
- **Connection Pooling** - Optimized database connections

### **Development Tools**
- **ESLint** - JavaScript linting
- **PostCSS** - CSS processing
- **npm** - Package manager

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MySQL Server** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Setup Instructions

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd CIAAN-CYBER-TECH-PRIVATE-LIMITED-Intership-Assignment-main
```

### **2. Backend Setup**

#### **Step 2.1: Navigate to Backend Directory**
```bash
cd backend
```

#### **Step 2.2: Install Dependencies**
```bash
npm install
```

#### **Step 2.3: Environment Configuration**
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your configuration:
   ```properties
   # Server Configuration
   PORT=5001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5174

   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=community_platform

   # JWT Configuration (Generate a strong secret key)
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRES_IN=7d

   # Security
   BCRYPT_ROUNDS=12

   # CORS Configuration
   CORS_ORIGIN=http://localhost:5174
   ```

#### **Step 2.4: Database Setup**
```bash
# Create database and tables
npm run setup-db

# Optional: Seed with demo data
npm run seed-db
```

#### **Step 2.5: Start Backend Server**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5001`

### **3. Frontend Setup**

#### **Step 3.1: Navigate to Frontend Directory**
```bash
cd ../frontend
```

#### **Step 3.2: Install Dependencies**
```bash
npm install
```

#### **Step 3.3: Environment Configuration**
Create a `.env` file in the frontend directory:
```properties
VITE_API_URL=http://localhost:5001
```

#### **Step 3.4: Start Frontend Development Server**
```bash
npm run dev
```

The frontend application will run on `http://localhost:5173` (or next available port)

### **4. Access the Application**
Open your web browser and navigate to the frontend URL (typically `http://localhost:5173`)

## 🔧 Available Scripts

### **Backend Scripts**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run setup-db` - Initialize database and create tables
- `npm run seed-db` - Populate database with demo data

### **Frontend Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🌟 Features

### **Authentication & Authorization**
- User registration with email validation
- Secure login with JWT tokens
- Password strength requirements
- Protected routes and middleware

### **User Management**
- User profiles with bio and avatar
- Profile editing capabilities
- User directory and search

### **Posts & Social Features**
- Create and publish posts
- View community feed
- User interactions and engagement

### **Security Features**
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS protection
- Input validation and sanitization
- Security headers with Helmet

## 🔒 Password Requirements

For security, passwords must contain:
- At least 6 characters
- One lowercase letter (a-z)
- One uppercase letter (A-Z)
- One number (0-9)

## 🗃️ Database Schema

### **Users Table**
- `id` - Primary key (AUTO_INCREMENT)
- `name` - Full name (VARCHAR)
- `email` - Email address (UNIQUE)
- `password` - Hashed password
- `bio` - User biography (TEXT)
- `avatar_url` - Profile picture URL
- `created_at` - Timestamp
- `updated_at` - Timestamp

### **Posts Table**
- `id` - Primary key (AUTO_INCREMENT)
- `user_id` - Foreign key to users table
- `content` - Post content (TEXT)
- `created_at` - Timestamp
- `updated_at` - Timestamp

## 🚨 Troubleshooting

### **Common Issues**

1. **Port Already in Use**
   - Change the PORT in backend `.env` file
   - Update FRONTEND_URL and CORS_ORIGIN accordingly

2. **Database Connection Failed**
   - Verify MySQL server is running
   - Check database credentials in `.env`
   - Ensure database exists or run `npm run setup-db`

3. **CORS Errors**
   - Verify CORS_ORIGIN matches frontend URL
   - Check FRONTEND_URL in backend `.env`

4. **Validation Errors**
   - Ensure passwords meet complexity requirements
   - Check email format is valid
   - Verify all required fields are provided

### **Environment Variables**
Make sure all required environment variables are set:
- Backend: `.env` file with database and JWT configuration
- Frontend: `.env` file with `VITE_API_URL`

## 🔄 Development Workflow

1. Start MySQL server
2. Start backend development server (`npm run dev` in backend folder)
3. Start frontend development server (`npm run dev` in frontend folder)
4. Both servers will auto-reload on file changes

## 📚 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify JWT token

### **Users**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### **Posts**
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### **Health Check**
- `GET /api/health` - Server health status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---

**Happy Coding! 🎉**

For any issues or questions, please refer to the troubleshooting section or create an issue in the repository.
