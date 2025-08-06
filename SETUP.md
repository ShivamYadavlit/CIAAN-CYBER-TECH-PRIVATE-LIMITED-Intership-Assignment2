# Setup Guide

Quick setup for the Community Platform social media app.

## 📋 Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Git

## 🚀 Installation

### 1. Clone & Install
```bash
git clone <repo-url>
cd community-platform

# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### 2. Environment Setup

**Backend `.env`:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/community_platform
JWT_SECRET=your-super-secret-key-here
PORT=5000
NODE_ENV=development
BCRYPT_ROUNDS=12
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://mongodb.com/atlas)
2. Create free cluster (M0)
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (development)
5. Copy connection string to `MONGODB_URI`

### 4. Start Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend  
npm run dev
```

### 5. Access App
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000/api

## 🛠️ Available Scripts

**Backend:**
```bash
npm run dev    # Development server
npm start      # Production server
```

**Frontend:**
```bash
npm run dev    # Development server
npm run build  # Production build
```

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | Change PORT in `.env` |
| MongoDB error | Check URI & IP whitelist |
| CORS error | Verify `VITE_API_URL` |
| JWT error | Set `JWT_SECRET` |

## ✅ Test Setup
1. Open http://localhost:5173
2. Register new account
3. Login with credentials
4. Create a post
5. View profile

---
**Ready to code!** 🚀
