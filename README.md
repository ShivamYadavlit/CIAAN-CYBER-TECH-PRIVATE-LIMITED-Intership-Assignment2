# MiniLinkedIn - Social Network Platform

A modern social networking platform built with React and Node.js, featuring user authentication, post creation, and real-time interactions.

## 🚀 Live Demo

- **Frontend**: [https://minilinkdin.onrender.com](https://minilinkdin.onrender.com)
- **Backend API**: [https://minilinkdin26.onrender.com](https://minilinkdin26.onrender.com)

## ✨ Features

- **User Authentication**: Secure registration and login system
- **Profile Management**: Create and edit user profiles with bio
- **Post Creation**: Share thoughts and updates with rich text
- **Social Interactions**: Like, comment, and share posts
- **Responsive Design**: Optimized for mobile devices (OnePlus 9, iPhone 12+)
- **Real-time Updates**: Dynamic content loading and interactions
- **Modern UI**: Glass-morphism design with smooth animations

## 🛠️ Tech Stack

For detailed technology information, see [TECH_STACK.md](./TECH_STACK.md)

### Frontend
- React 19 with Hooks
- Vite for fast development
- Tailwind CSS for responsive design
- Lucide React for icons
- React Router for navigation

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password security
- CORS for cross-origin requests

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (free tier)
- Git

## 🔧 Installation & Setup

For detailed setup instructions, see [SETUP.md](./SETUP.md)

### Quick Start

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
