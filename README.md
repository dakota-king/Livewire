# 🔥 Livewire Chat - Real-time Chat Application

> **A modern, full-stack real-time chat application built with Next.js, Express.js, Socket.IO, Prisma, MySQL, and Redis**

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## ✨ Features

### 🚀 **Real-time Communication**
- **Instant messaging** with Socket.IO WebSocket connections
- **Live typing indicators** showing when users are typing
- **Real-time user presence** with online/offline status indicators
- **Automatic reconnection** with connection status feedback
- **Room-based chat system** with seamless switching

### 🎨 **Modern User Experience**
- **Sleek dark theme** with glassmorphism effects and gradients
- **Fully responsive design** optimized for desktop, tablet, and mobile
- **Smooth animations** and micro-interactions for delightful UX
- **Accessibility-first** design with proper ARIA labels and keyboard navigation

### 🏠 **Room Management**
- **Dynamic room lobby** with live previews and user counts
- **Create custom rooms** with names and descriptions
- **Message persistence** with full chat history
- **Online user lists** showing active participants in each room
- **Seamless room switching** with state preservation

### 🛡️ **Production-Ready Features**
- **Rate limiting** (30 messages/minute) to prevent spam
- **Input validation** and sanitization on all endpoints
- **Comprehensive error handling** with user-friendly messages
- **Environment-based configuration** for different deployment stages
- **Docker support** for consistent development and deployment

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16.x or higher
- **Docker & Docker Compose** (recommended)
- **Git**

### 1. Clone & Start Services
```bash
git clone <repository-url>
cd livewire-chat

# Start MySQL and Redis with Docker
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
echo 'DATABASE_URL=mysql://livewire_user:your_mysql_password@localhost:3307/livewire_chat
REDIS_URL=redis://localhost:6379
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-here' > .env

# Set up database and start server
npm run db:generate
npm run db:push
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env.local file
echo 'NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SERVER_URL=http://localhost:5000' > .env.local

# Start development server
npm run dev
```

### 4. Open the App
Visit **http://localhost:3000** to start chatting! 🎉

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Socket.IO Client |
| **Backend** | Express.js, TypeScript, Socket.IO, Prisma ORM |
| **Database** | MySQL 8.0, Redis 6.x |
| **Infrastructure** | Docker, Docker Compose |

## 📁 Project Structure

```
livewire-chat/
├── 📁 backend/          # Express.js API server
│   ├── 📁 src/routes/   # REST API endpoints
│   ├── 📁 src/socket/   # Socket.IO handlers
│   └── 📄 README.md     # Backend docs
├── 📁 frontend/         # Next.js React app
│   ├── 📁 src/app/      # Next.js App Router
│   ├── 📁 src/components/ # React components
│   └── 📄 README.md     # Frontend docs
└── 📄 docker-compose.yml # Docker services
```

## 📱 How to Use

1. **Enter Username** → Join the chat with your chosen name
2. **Browse Rooms** → See available chat rooms with live previews
3. **Create Room** → Make new chat spaces with custom names
4. **Start Chatting** → Send messages and see real-time responses
5. **See Who's Online** → View active users in each room

## 🌐 API Documentation

### REST Endpoints
- `GET /api/health` - Health check
- `GET /api/rooms` - Get all rooms with metadata
- `POST /api/rooms` - Create new room
- `GET /api/rooms/:id/messages` - Get message history
- `GET /api/rooms/:id/users` - Get online users

### WebSocket Events
- `join-room` / `leave-room` - Room management
- `send-message` - Send chat messages
- `typing-start` / `typing-stop` - Typing indicators
- `message-received` - Receive new messages
- `user-joined` / `user-left` - User presence updates

## 🔧 Development Commands

### Backend
```bash
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run db:studio    # Open database GUI
```

### Frontend
```bash
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Docker
```bash
docker-compose up -d     # Start services
docker-compose ps        # Check status
docker-compose down      # Stop services
```

## 🔒 Security & Performance

- **Rate limiting** to prevent spam (30 messages/minute)
- **Input validation** on all endpoints
- **Redis caching** for optimal performance
- **Database connection pooling** with Prisma
- **CORS configuration** for secure requests
- **Environment variable protection**

## 🚀 Deployment

Ready for production deployment on platforms like:
- **Frontend**: Vercel, Netlify, AWS Amplify
- **Backend**: Railway, Render, DigitalOcean
- **Database**: PlanetScale, AWS RDS, Google Cloud SQL

## 📄 License

This project is licensed under the ISC License.

For detailed documentation, see:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
