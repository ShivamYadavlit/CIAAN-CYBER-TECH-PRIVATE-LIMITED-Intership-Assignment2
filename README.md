# Mini LinkedIn-like Community Platform

A modern, full-stack web application inspired by LinkedIn, built with React, Node.js, Express, and MySQL. This platform provides a beautiful, responsive interface for users to register, create profiles, share posts, and interact with a community.

![Mini LinkedIn Platform](https://img.shields.io/badge/Status-Production%20Ready-green) ![React](https://img.shields.io/badge/React-18.x-blue) ![Node.js](https://img.shields.io/badge/Node.js-18.x-green) ![MySQL](https://img.shields.io/badge/MySQL-8.x-orange)

## � Quick Start

**For detailed setup instructions, technology stack, and troubleshooting guide, see [SETUP.md](./SETUP.md)**

## �🚀 Features

### Authentication & Security
- ✅ JWT-based authentication with secure token management
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Input validation and sanitization
- ✅ Rate limiting and security headers
- ✅ CORS protection

### User Management
- ✅ User registration with email validation
- ✅ Secure login with demo account support
- ✅ User profiles with bio and avatar support
- ✅ Profile editing functionality
- ✅ Password strength validation

### Social Features
- ✅ Create, read, update, and delete posts
- ✅ Real-time post feed with pagination
- ✅ User-specific post views
- ✅ Post interaction (like, comment, share UI)
- ✅ Responsive design for all devices

### UI/UX Excellence
- ✅ Modern LinkedIn-inspired design
- ✅ Smooth animations and transitions
- ✅ Loading states and error handling
- ✅ Mobile-first responsive design
- ✅ Beautiful color scheme and typography
- ✅ Intuitive navigation and user flow

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL Server** (v8 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- **npm** or **yarn** package manager
- **Git** (optional) - [Download](https://git-scm.com/)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mini-linkedin-platform
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### 3. Database Configuration

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE community_platform;
   ```

2. **Configure Environment Variables:**
   
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your MySQL credentials:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=community_platform

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRES_IN=7d
   ```

3. **Initialize Database Tables:**
   ```bash
   npm run setup-db
   ```

### 4. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

### 5. Start the Application

Start the backend server:
```bash
cd backend
npm run dev
```

In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## 👤 Demo Account

For quick testing, you can use the demo account:

- **Email:** `demo@example.com`
- **Password:** `Demo@1234`

Or create a new account using the registration form.

## 📁 Project Structure

```
mini-linkedin-platform/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── common/      # Common components (Navbar, etc.)
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js backend application
│   ├── config/              # Database configuration
│   ├── controllers/         # Request handlers (future use)
│   ├── middleware/          # Custom middleware
│   ├── routes/              # API route definitions
│   ├── server.js            # Main server file
│   └── package.json         # Backend dependencies
└── README.md               # Project documentation
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/posts` - Get user's posts
- `GET /api/users` - Search users

### Posts
- `POST /api/posts` - Create new post
- `GET /api/posts` - Get all posts (feed)
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

## 🎨 UI Components & Design

### Design System
- **Primary Color:** LinkedIn Blue (#0077b5)
- **Typography:** Inter font family
- **Spacing:** Tailwind's spacing system
- **Components:** Custom utility classes for consistency

### Key Components
- **Navbar** - Responsive navigation with search
- **PostCard** - Interactive post display
- **AuthForms** - Beautiful login/register forms
- **LoadingSpinner** - Consistent loading states
- **ProtectedRoute** - Route protection wrapper

## 🔒 Security Features

- **Password Hashing:** bcrypt with 12 salt rounds
- **JWT Authentication:** Secure token-based auth
- **Input Validation:** Express Validator for all inputs
- **Rate Limiting:** Prevents API abuse
- **CORS Protection:** Configured for security
- **SQL Injection Prevention:** Parameterized queries
- **XSS Protection:** Input sanitization

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Backend (Render/Heroku)
1. Create a new app on your hosting platform
2. Set environment variables
3. Connect to a managed MySQL database
4. Deploy with automatic builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- LinkedIn for design inspiration
- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- The open-source community for excellent packages

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Made with ❤️ for the developer community**
