# MiniLinkedIn - Social Network Platform

A modern social networking platform built with React and Node.js, featuring user authentication, post creation, and real-time interactions with mobile-responsive design.

## 🚀 Live Demo

- **Frontend**: [https://minilinkdin.onrender.com](https://minilinkdin.onrender.com)
- **Backend API**: [https://minilinkdin26.onrender.com](https://minilinkdin26.onrender.com)

## ✨ Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Profile Management**: Create and edit user profiles with bio and personal information
- **Post Creation**: Share thoughts and updates with rich text content
- **Social Interactions**: Like, comment, and share posts with other users
- **Responsive Design**: Optimized for mobile devices (OnePlus 9, iPhone 12, Android phones)
- **Real-time Updates**: Dynamic content loading and live interactions
- **Modern UI**: Glass-morphism design with smooth animations and hover effects
- **Mobile-First**: Touch-friendly interface with proper touch targets (44px minimum)

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with Hooks and Context API
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **React Router Dom** - Client-side routing and navigation
- **Lucide React** - Beautiful SVG icons
- **JavaScript (ES6+)** - Modern JavaScript features

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - ODM for MongoDB with schema validation
- **JWT (jsonwebtoken)** - Secure authentication tokens
- **bcryptjs** - Password hashing and security
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code linting and quality assurance
- **VS Code** - Development environment
- **Git** - Version control system
- **npm** - Package manager

### Deployment & Hosting
- **Render.com** - Frontend and backend hosting
- **MongoDB Atlas** - Cloud database hosting (free tier)
- **GitHub** - Code repository and version control

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB Atlas Account** (free) - [Sign up here](https://www.mongodb.com/atlas)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/minilinkedin-app.git
cd minilinkedin-app
```

### 2. Backend Setup

#### Install Backend Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration (Replace with your MongoDB Atlas URI)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/minilinkedin?retryWrites=true&w=majority

# JWT Configuration (Generate a strong secret)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random
JWT_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

#### Setup Database
```bash
# Setup database tables/collections
npm run setup-db

# Seed database with demo data (optional)
npm run seed-db
```

#### Start Backend Server
```bash
npm run dev
# Backend will run on http://localhost:3000
```

### 3. Frontend Setup

#### Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### Start Frontend Development Server
```bash
npm run dev
# Frontend will run on http://localhost:5173
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api

## 🏗️ Project Structure

```
minilinkedin-app/
├── frontend/                    # React frontend application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── common/        # Common components (Navbar, LoadingSpinner)
│   │   ├── pages/             # Route components
│   │   │   ├── Home.jsx       # Main feed page
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Register.jsx   # Registration page
│   │   │   └── Profile.jsx    # User profile page
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service functions
│   │   ├── contexts/          # React context providers
│   │   ├── assets/            # Images and static files
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # React entry point
│   ├── index.html             # HTML template
│   ├── package.json           # Frontend dependencies
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── vite.config.js         # Vite configuration
├── backend/                     # Node.js backend API
│   ├── config/                # Database configuration
│   ├── middleware/            # Express middleware
│   │   ├── auth.js           # Authentication middleware
│   │   └── validation.js     # Input validation middleware
│   ├── routes/               # API route handlers
│   │   ├── auth.js          # Authentication routes
│   │   ├── posts.js         # Post-related routes
│   │   └── users.js         # User-related routes
│   ├── server.js            # Main server file
│   ├── setup-db.js          # Database setup script
│   ├── seed-db.js           # Database seeding script
│   └── package.json         # Backend dependencies
├── README.md                # Project documentation
├── SETUP.md                # Detailed setup guide
└── TECH_STACK.md           # Technology stack details
```

## 🔐 Environment Variables

### Backend (.env)
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Production URLs (for deployment)
PRODUCTION_URL=https://your-backend-url.com
PRODUCTION_FRONTEND_URL=https://your-frontend-url.com
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post (owner only)
- `DELETE /api/posts/:id` - Delete post (owner only)

## 📱 Mobile Responsiveness

This application is fully optimized for mobile devices:

### Supported Devices
- **OnePlus 9** (360px width)
- **iPhone 12** (390px width)
- **Samsung Galaxy S20** (360px width)
- **Google Pixel 5** (393px width)
- **All Android devices** (320px+ width)

### Mobile Features
- **Touch-friendly UI** - 44px minimum touch targets
- **Responsive typography** - Scales from mobile to desktop
- **Mobile-first design** - Progressive enhancement
- **Touch gestures** - Optimized for finger navigation
- **iOS safe areas** - Proper handling of notches and home indicators

## 🎨 UI/UX Features

- **Glass-morphism Design** - Modern translucent UI elements
- **Gradient Backgrounds** - Beautiful color transitions
- **Smooth Animations** - Hover effects and transitions
- **Loading States** - User feedback during operations
- **Error Handling** - Graceful error messages and recovery
- **Accessibility** - Keyboard navigation and screen reader support

## � Development Commands

### Backend Commands
```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm run setup-db    # Setup database schema
npm run seed-db     # Seed database with demo data
```

### Frontend Commands
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## 🚀 Deployment

### Backend Deployment (Render.com)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables in Render dashboard
4. Deploy automatically on git push

### Frontend Deployment (Render.com)
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy automatically on git push

### Environment Variables for Production
Make sure to set these in your production environment:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Strong secret key for JWT tokens
- `PRODUCTION_URL` - Your backend production URL
- `PRODUCTION_FRONTEND_URL` - Your frontend production URL

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
- Verify your MongoDB Atlas connection string
- Check if your IP address is whitelisted in MongoDB Atlas
- Ensure the database user has proper permissions

**2. Frontend Can't Connect to Backend**
- Check if backend is running on port 3000
- Verify CORS settings in backend
- Check API URLs in frontend service files

**3. Authentication Issues**
- Verify JWT_SECRET is set correctly
- Check if tokens are being stored in localStorage
- Ensure authentication middleware is working

**4. Mobile Display Issues**
- Clear browser cache
- Check viewport meta tag in index.html
- Verify Tailwind CSS responsive classes

## 📄 License

This project is part of the **CIAAN CYBER TECH PRIVATE LIMITED** internship assignment.

## 🤝 Contributing

This is an internship assignment project. For suggestions or issues:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For technical support or questions:
- Check the [SETUP.md](./SETUP.md) for detailed instructions
- Review the [TECH_STACK.md](./TECH_STACK.md) for technology details
- Contact the development team

---

**Built with ❤️ by CIAAN CYBER TECH Development Team**

1. **Clone the repository**
```bash
git clone <repository-url>
cd CIAAN-CYBER-TECH-PRIVATE-LIMITED-Intership-Assignment-main
```

2. **Install dependencies**
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**
```bash
# Backend .env file
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and JWT secret
```

4. **Start the application**
```bash
# Terminal 1: Start backend (from root directory)
npm run dev:backend

# Terminal 2: Start frontend (from root directory)
npm run dev:frontend
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📱 Mobile Responsiveness

The application is fully optimized for mobile devices:

- **OnePlus 9** (360px width)
- **iPhone 12** (390px width)
- **Android devices** (320px+ width)
- **Touch-friendly** interfaces with 44px minimum touch targets
- **Progressive enhancement** from mobile to desktop

## 🏗️ Project Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   └── contexts/       # React context providers
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend API
│   ├── routes/             # API route handlers
│   ├── middleware/         # Express middleware
│   ├── config/             # Database configuration
│   └── package.json        # Backend dependencies
├── README.md               # Main project documentation
├── SETUP.md               # Detailed setup instructions
└── TECH_STACK.md          # Technology stack details
```

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Post Endpoints
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

## 🎨 Design Features

- **Glass-morphism UI** with backdrop blur effects
- **Gradient backgrounds** and modern color schemes
- **Smooth animations** and hover effects
- **Responsive typography** scaling across devices
- **Touch-optimized interactions** for mobile devices

## 🔧 Development Scripts

```bash
# Root directory scripts
npm run dev:backend          # Start backend development server
npm run dev:frontend         # Start frontend development server
npm run setup:db            # Setup database
npm run seed:db             # Seed database with sample data

# Backend scripts
npm run dev                 # Start backend in development mode
npm start                   # Start backend in production mode

# Frontend scripts
npm run dev                 # Start frontend development server
npm run build               # Build for production
npm run preview             # Preview production build
```

## 🚀 Deployment

The application is deployed on Render.com:

- **Frontend**: Deployed as a static site
- **Backend**: Deployed as a web service
- **Database**: MongoDB Atlas (free tier)

## 📄 License

This project is part of the CIAAN CYBER TECH PRIVATE LIMITED internship assignment.

## 👥 Contributing

This is an internship assignment project. For any questions or suggestions, please contact the development team.

## 📞 Support

For any issues or questions, please refer to the [SETUP.md](./SETUP.md) file or contact the development team.
