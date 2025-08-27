# Livewire Chat Backend

A real-time chat application backend built with Express.js, Socket.IO, Prisma, MySQL, and Redis.

## Features

- **Real-time messaging** with Socket.IO
- **Room-based chat** system
- **User presence tracking** and online status
- **Message persistence** with MySQL database
- **Redis caching** for session management and rate limiting
- **Typing indicators** for enhanced user experience
- **RESTful API** for room and message management
- **Rate limiting** to prevent spam
- **Graceful error handling** and connection recovery

## Tech Stack

- **Node.js** & **TypeScript**
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **Prisma** - Database ORM
- **MySQL** - Database
- **Redis** - Caching and session management
- **Cors** - Cross-origin resource sharing

## Prerequisites

Before running the application, make sure you have:

- Node.js (v16 or higher)
- MySQL database server
- Redis server
- npm or yarn package manager

## Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the `.env` file and update the values:
   ```bash
   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/livewire_chat"
   
   # Redis
   REDIS_URL="redis://localhost:6379"
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # JWT (for future authentication)
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Create and apply migrations
   npm run db:migrate
   
   # Or push schema directly (for development)
   npm run db:push
   ```

5. **Start Redis server**
   
   Make sure Redis is running on your system:
   ```bash
   redis-server
   ```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Database Management
```bash
# Generate Prisma client
npm run db:generate

# Create and apply migration
npm run db:migrate

# Push schema changes (development)
npm run db:push

# Open Prisma Studio
npm run db:studio
```

## API Endpoints

### Rooms

#### GET /api/rooms
Get all chat rooms with metadata.

**Response:**
```json
[
  {
    "id": "room_id",
    "name": "General Chat",
    "description": "Main discussion room",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "onlineCount": 5,
    "lastMessage": {
      "content": "Hello everyone!",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "username": "john_doe"
    }
  }
]
```

#### POST /api/rooms
Create a new chat room.

**Request Body:**
```json
{
  "name": "New Room",
  "description": "Optional description"
}
```

**Response:**
```json
{
  "id": "new_room_id",
  "name": "New Room",
  "description": "Optional description",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### GET /api/rooms/:id/messages
Get message history for a specific room.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Messages per page (default: 50)

**Response:**
```json
{
  "messages": [
    {
      "id": "message_id",
      "content": "Hello!",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "username": "john_doe"
      }
    }
  ],
  "page": 1,
  "hasMore": false
}
```

#### GET /api/rooms/:id/users
Get online users in a specific room.

**Response:**
```json
[
  {
    "id": "user_id",
    "username": "john_doe",
    "lastSeen": "2024-01-01T00:00:00.000Z"
  }
]
```

## WebSocket Events

### Client to Server Events

#### join-room
Join a chat room.
```javascript
socket.emit('join-room', {
  roomId: 'room_id',
  username: 'john_doe'
});
```

#### leave-room
Leave the current room.
```javascript
socket.emit('leave-room', {
  roomId: 'room_id'
});
```

#### send-message
Send a message to the current room.
```javascript
socket.emit('send-message', {
  roomId: 'room_id',
  content: 'Hello everyone!',
  username: 'john_doe'
});
```

#### typing-start / typing-stop
Indicate typing status.
```javascript
socket.emit('typing-start', {
  roomId: 'room_id',
  username: 'john_doe',
  isTyping: true
});
```

### Server to Client Events

#### message-received
Receive a new message.
```javascript
socket.on('message-received', (message) => {
  console.log('New message:', message);
});
```

#### user-joined / user-left
User presence updates.
```javascript
socket.on('user-joined', ({ username, roomId }) => {
  console.log(`${username} joined ${roomId}`);
});
```

#### typing-update
Typing indicator updates.
```javascript
socket.on('typing-update', ({ username, isTyping }) => {
  console.log(`${username} is ${isTyping ? 'typing' : 'not typing'}`);
});
```

#### room-users-updated
Updated list of online users.
```javascript
socket.on('room-users-updated', (users) => {
  console.log('Online users:', users);
});
```

#### error
Error messages.
```javascript
socket.on('error', ({ message }) => {
  console.error('Socket error:', message);
});
```

## Database Schema

### Users
- `id` - Unique identifier (CUID)
- `username` - Unique username
- `lastSeen` - Last activity timestamp
- `createdAt` - Account creation date
- `updatedAt` - Last update timestamp

### Rooms
- `id` - Unique identifier (CUID)
- `name` - Unique room name
- `description` - Optional room description
- `createdAt` - Room creation date
- `updatedAt` - Last activity timestamp

### Messages
- `id` - Unique identifier (CUID)
- `content` - Message text content
- `userId` - Foreign key to Users
- `roomId` - Foreign key to Rooms
- `createdAt` - Message timestamp

### UserRooms
- `id` - Unique identifier (CUID)
- `userId` - Foreign key to Users
- `roomId` - Foreign key to Rooms
- `joinedAt` - When user joined the room

## Redis Usage

### Session Management
- `user:{socketId}` - User session data
- `room:{roomId}:users` - Set of online users in room

### Caching
- `room:{roomId}:recent_messages` - Cache of recent messages (last 50)

### Rate Limiting
- `rate_limit:{userId}` - Message count per minute per user

## Architecture

The backend follows a modular architecture:

```
src/
├── index.ts          # Main server file
├── routes/           # REST API routes
│   └── rooms.ts      # Room-related endpoints
├── socket/           # Socket.IO handlers
│   └── socketHandlers.ts
└── types/            # TypeScript interfaces
    └── index.ts
```

## Error Handling

The application includes comprehensive error handling:

- **Database errors** - Graceful fallbacks and error messages
- **Redis connection issues** - Automatic reconnection attempts
- **Socket disconnections** - Cleanup and user removal
- **Rate limiting** - Prevents message spam
- **Input validation** - Sanitizes and validates all inputs

## Security Features

- **Rate limiting** on message sending
- **Input sanitization** and validation
- **CORS configuration** for cross-origin requests
- **Environment variable protection** for sensitive data

## Performance Optimizations

- **Redis caching** for frequently accessed data
- **Database indexing** on commonly queried fields
- **Connection pooling** with Prisma
- **Efficient WebSocket room management**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
