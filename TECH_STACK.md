# Technology Stack Overview

## 🛠️ Complete Technology Stack

### **Frontend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI library for building user interfaces |
| Vite | Latest | Fast build tool and development server |
| Tailwind CSS | Latest | Utility-first CSS framework |
| React Router DOM | Latest | Client-side routing |
| Axios | Latest | HTTP client for API requests |
| Lucide React | Latest | Icon library |
| PostCSS | Latest | CSS post-processor |

### **Backend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 16+ | JavaScript runtime environment |
| Express.js | Latest | Web application framework |
| MySQL | 8.x | Relational database |
| JWT | Latest | Authentication tokens |
| bcryptjs | Latest | Password hashing |
| express-validator | Latest | Input validation |
| cors | Latest | Cross-origin resource sharing |
| helmet | Latest | Security middleware |
| morgan | Latest | HTTP request logger |
| express-rate-limit | Latest | Rate limiting |
| dotenv | Latest | Environment variables |
| nodemon | Latest | Development auto-restart |

### **Database & Storage**
| Technology | Purpose |
|------------|---------|
| MySQL 2 | Promise-based MySQL client |
| Connection Pooling | Optimized database connections |

### **Development Tools**
| Tool | Purpose |
|------|---------|
| ESLint | Code linting and quality |
| PostCSS | CSS processing |
| npm | Package management |
| Git | Version control |

### **Security Features**
- **Authentication**: JWT tokens with secure headers
- **Password Security**: bcrypt hashing with 12 rounds
- **Input Validation**: express-validator middleware
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Cross-origin request protection
- **Security Headers**: Helmet middleware for HTTP headers
- **Environment Variables**: Secure configuration management

### **Performance Features**
- **Connection Pooling**: Optimized database connections
- **Rate Limiting**: API endpoint protection
- **Lazy Loading**: Efficient resource loading
- **Caching**: Browser and server-side caching
- **Compression**: Response compression middleware

## 🏗️ Architecture Pattern

**MVC Architecture with Modern Stack:**
- **Model**: MySQL database with structured schema
- **View**: React components with Tailwind CSS
- **Controller**: Express.js route handlers
- **Middleware**: Authentication, validation, security layers

## 🔧 Development Environment

**Required Software:**
- Node.js (16.0.0+)
- MySQL Server (8.0+)
- npm or yarn
- Git
- Code editor (VS Code recommended)

**Optional Tools:**
- MySQL Workbench (database management)
- Postman (API testing)
- React Developer Tools (browser extension)

## 📦 Package Management

**Frontend Dependencies:**
```json
{
  "react": "^18.x",
  "vite": "latest",
  "tailwindcss": "latest",
  "react-router-dom": "latest",
  "axios": "latest",
  "lucide-react": "latest"
}
```

**Backend Dependencies:**
```json
{
  "express": "latest",
  "mysql2": "latest",
  "jsonwebtoken": "latest",
  "bcryptjs": "latest",
  "express-validator": "latest",
  "cors": "latest",
  "helmet": "latest",
  "morgan": "latest",
  "express-rate-limit": "latest",
  "dotenv": "latest"
}
```

**Development Dependencies:**
```json
{
  "nodemon": "latest",
  "eslint": "latest",
  "postcss": "latest"
}
```

## 🌐 Server Configuration

**Backend Server:**
- Port: 5001 (configurable)
- Environment: Development/Production
- CORS: Frontend URL whitelist
- Rate Limiting: 100 requests per 15 minutes
- Timeout: 10 seconds for API requests

**Frontend Server:**
- Port: 5173+ (auto-assigned by Vite)
- Hot Module Replacement: Enabled
- Build Tool: Vite with optimized bundling
- CSS Processing: Tailwind with PostCSS

## 📊 Database Configuration

**MySQL Settings:**
- Engine: InnoDB
- Charset: utf8mb4_unicode_ci
- Connection Pool: 10 connections
- Foreign Keys: Enabled
- Indexes: Optimized for queries

**Tables:**
- Users (authentication and profiles)
- Posts (user-generated content)
- Future: Comments, Likes, Follows

This stack provides a modern, scalable, and secure foundation for the Mini LinkedIn platform.
