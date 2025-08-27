# 🔥 Livewire Chat Backend

> **High-performance real-time chat server built with Express.js, Socket.IO, Prisma, and Redis**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

## ✨ Features

### 🚀 **Real-time Communication**
- **WebSocket connections** with Socket.IO for instant messaging
- **Room-based chat system** with automatic user presence tracking
- **Typing indicators** with real-time broadcast to room members
- **Connection status management** with graceful reconnection handling

### 🗄️ **Data Management**
- **MySQL database** with Prisma ORM for robust data persistence
- **Redis caching** for session management and real-time data
- **Message history** with efficient pagination
- **User presence tracking** with automatic cleanup

### 🛡️ **Security & Performance**
- **Rate limiting** (30 messages/minute per user)
- **Input validation** and sanitization
- **CORS configuration** for secure cross-origin requests
- **Environment variable protection**
- **SQL injection prevention** with Prisma ORM

### 🔧 **Developer Experience**
- **TypeScript** for type safety and better development experience
- **Hot reload** with nodemon for rapid development
- **Comprehensive error handling** with detailed logging
- **RESTful API** design with clear endpoint structure

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (MySQL)       │
│                 │    │                 │    │                 │
│ Socket.IO Client│    │ Socket.IO Server│    │ Prisma ORM      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │   (Caching)     │
                       └─────────────────┘
```

## 📋 Prerequisites

- **Node.js** 16.x or higher
- **MySQL** 8.0 or higher
- **Redis** 6.x or higher
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/livewire_chat"

# Redis Configuration  
REDIS_URL="redis://localhost:6379"

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key-here
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Optional: Open Prisma Studio
npm run db:studio
```

### 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000` 🚀

## 📡 API Documentation

### 🌐 REST Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/health` | Health check | `{ status: "OK", timestamp: "..." }` |
| `GET` | `/api/rooms` | Get all chat rooms | `Room[]` with metadata |
| `POST` | `/api/rooms` | Create new room | `Room` object |
| `GET` | `/api/rooms/:id/messages` | Get room messages | Paginated `Message[]` |
| `GET` | `/api/rooms/:id/users` | Get online users | `User[]` in room |

### 🔌 WebSocket Events

#### **Client → Server**
```typescript
// Join a chat room
socket.emit('join-room', { roomId: string, username: string })

// Leave current room
socket.emit('leave-room', {})

// Send a message
socket.emit('send-message', { roomId: string, content: string, username: string })

// Typing indicators
socket.emit('typing-start', { roomId: string, username: string })
socket.emit('typing-stop', { roomId: string, username: string })
```

#### **Server → Client**
```typescript
// New message received
socket.on('message-received', (message: Message) => {})

// User presence updates
socket.on('user-joined', ({ username: string, roomId: string }) => {})
socket.on('user-left', ({ username: string, roomId: string }) => {})

// Typing updates
socket.on('typing-update', ({ username: string, isTyping: boolean }) => {})

// Room updates
socket.on('room-users-updated', (users: User[]) => {})

// Error handling
socket.on('error', ({ message: string }) => {})
```

## 🗃️ Database Schema

### **Users**
```sql
CREATE TABLE users (
  id VARCHAR(191) PRIMARY KEY,
  username VARCHAR(191) UNIQUE NOT NULL,
  lastSeen DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Rooms**
```sql
CREATE TABLE rooms (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(191) UNIQUE NOT NULL,
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Messages**
```sql
CREATE TABLE messages (
  id VARCHAR(191) PRIMARY KEY,
  content TEXT NOT NULL,
  userId VARCHAR(191) NOT NULL,
  roomId VARCHAR(191) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (roomId) REFERENCES rooms(id) ON DELETE CASCADE,
  INDEX idx_room_created (roomId, createdAt)
);
```

### **UserRooms** (Junction Table)
```sql
CREATE TABLE user_rooms (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191) NOT NULL,
  roomId VARCHAR(191) NOT NULL,
  joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (roomId) REFERENCES rooms(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_room (userId, roomId)
);
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── routes/              # REST API routes
│   │   └── rooms.ts         # Room management endpoints
│   ├── socket/              # Socket.IO handlers
│   │   └── socketHandlers.ts # Real-time event handling
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # Shared type definitions
│   └── index.ts             # Main server entry point
├── prisma/
│   └── schema.prisma        # Database schema definition
├── .env                     # Environment variables (create this)
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── nodemon.json             # Development server config
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

## ⚡ Performance Features

- **Connection pooling** with Prisma for efficient database connections
- **Redis caching** for frequently accessed data and sessions
- **Rate limiting** to prevent spam and abuse
- **Optimized database queries** with proper indexing
- **Efficient WebSocket room management** for scalability

## 🔒 Security Features

- **Environment variable protection** for sensitive configuration
- **Input validation** on all endpoints and socket events
- **Rate limiting** to prevent message flooding
- **CORS configuration** for secure cross-origin requests
- **SQL injection prevention** through Prisma ORM
- **Error handling** without exposing internal details

## 🐳 Docker Support

The backend works seamlessly with Docker. See the root `docker-compose.yml` for:
- **Redis** container with persistence
- **MySQL** container with proper configuration
- **Environment variable** management
- **Health checks** for service monitoring

## 🔧 Development

### Hot Reload Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm run start
```

### Database Operations
```bash
# Reset database
npm run db:push --force-reset

# View data
npm run db:studio
```

## 🚀 Deployment

### **⚠️ Important: WebSocket Deployment Considerations**

**Vercel does NOT support WebSockets** due to its serverless nature. For this Socket.IO backend, use:

### **Recommended Platforms for WebSocket Support**
- **🚂 Railway** - Best for full-stack apps with WebSockets
- **🎨 Render** - Excellent WebSocket support, easy setup
- **🌊 DigitalOcean** - App Platform with container support
- **🚀 Fly.io** - Modern platform with persistent connections
- **☁️ AWS EC2** - Traditional server hosting

### **Hybrid Deployment Strategy (Recommended)**
```
Frontend (Next.js) → Vercel
Backend (Socket.IO) → Railway/Render
Database → PlanetScale/AWS RDS
Redis → Redis Cloud
```

### Environment Variables for Production
```env
DATABASE_URL="mysql://user:pass@host:port/database"
REDIS_URL="redis://user:pass@host:port"
PORT=5000
NODE_ENV=production
JWT_SECRET=your-production-secret-key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Build and Deploy
```bash
npm run build
npm run start
```

### **Railway Deployment (Recommended)**

**Step-by-step deployment:**

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login and initialize:**
```bash
railway login
railway init
```

3. **Set environment variables in Railway dashboard:**
```env
DATABASE_URL=mysql://your-database-url
REDIS_URL=redis://your-redis-url
PORT=5000
NODE_ENV=production
JWT_SECRET=your-production-secret
FRONTEND_URL=https://your-frontend.vercel.app
```

4. **Deploy:**
```bash
railway up
```

5. **Your backend will be available at:** `https://your-app.railway.app`

**Why Railway?**
- ✅ **Native WebSocket support** (unlike Vercel)
- ✅ **Zero config deployment** from GitHub
- ✅ **Automatic HTTPS** and custom domains
- ✅ **Environment variable management**
- ✅ **Affordable pricing** (~$5/month)
- ✅ **Excellent developer experience**

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check MySQL is running
mysql --version

# Verify connection string
npm run db:push
```

**Redis Connection Failed**
```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

**TypeScript Errors**
```bash
# Regenerate Prisma client
npm run db:generate

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📊 Monitoring

The backend includes comprehensive logging:
- **Connection events** (user join/leave)
- **Message events** (send/receive)
- **Error events** (with stack traces)
- **Performance metrics** (response times)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ using modern technologies for real-time communication**