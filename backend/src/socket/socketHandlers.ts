import { Server, Socket } from 'socket.io';
import { prisma, redis } from '../index';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  JoinRoomData,
  SendMessageData,
  TypingData
} from '../types';

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function setupSocketHandlers(io: TypedServer) {
  io.on('connection', (socket: TypedSocket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle joining a room
    socket.on('join-room', async (data: JoinRoomData) => {
      try {
        const { roomId, username } = data;

        // Validate input
        if (!roomId || !username) {
          socket.emit('error', { message: 'Room ID and username are required' });
          return;
        }

        // Check if room exists
        const room = await prisma.room.findUnique({
          where: { id: roomId }
        });

        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Find or create user
        let user = await prisma.user.findUnique({
          where: { username }
        });

        if (!user) {
          user = await prisma.user.create({
            data: { username }
          });
        } else {
          // Update last seen
          await prisma.user.update({
            where: { id: user.id },
            data: { lastSeen: new Date() }
          });
        }

        // Leave previous room if any
        if (socket.data.currentRoom) {
          await leaveRoom(socket, socket.data.currentRoom, io);
        }

        // Join the new room
        socket.join(roomId);
        socket.data.userId = user.id;
        socket.data.username = username;
        socket.data.currentRoom = roomId;

        // Add user to Redis room set
        await redis.sAdd(`room:${roomId}:users`, user.id);
        await redis.set(`user:${socket.id}`, JSON.stringify({
          userId: user.id,
          username,
          roomId
        }));

        // Create or update UserRoom relationship
        await prisma.userRoom.upsert({
          where: {
            userId_roomId: {
              userId: user.id,
              roomId
            }
          },
          update: {},
          create: {
            userId: user.id,
            roomId
          }
        });

        // Notify other users in the room
        socket.to(roomId).emit('user-joined', { username, roomId });

        // Send updated user list to all users in the room
        await sendRoomUserList(io, roomId);

        console.log(`User ${username} joined room ${roomId}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Handle leaving a room
    socket.on('leave-room', async (data) => {
      if (socket.data.currentRoom) {
        await leaveRoom(socket, socket.data.currentRoom, io);
      }
    });

    // Handle sending messages
    socket.on('send-message', async (data: SendMessageData) => {
      try {
        const { roomId, content, username } = data;

        if (!roomId || !content || !username) {
          socket.emit('error', { message: 'Missing required fields' });
          return;
        }

        if (!socket.data.userId || socket.data.currentRoom !== roomId) {
          socket.emit('error', { message: 'You must join the room first' });
          return;
        }

        // Rate limiting check
        const rateLimitKey = `rate_limit:${socket.data.userId}`;
        const messageCount = await redis.incr(rateLimitKey);
        if (messageCount === 1) {
          await redis.expire(rateLimitKey, 60); // 1 minute window
        }
        if (messageCount > 30) { // Max 30 messages per minute
          socket.emit('error', { message: 'Rate limit exceeded. Please slow down.' });
          return;
        }

        // Create message in database
        const message = await prisma.message.create({
          data: {
            content: content.trim(),
            userId: socket.data.userId,
            roomId
          },
          include: {
            user: {
              select: { username: true }
            }
          }
        });

        // Cache recent message in Redis
        await redis.lPush(`room:${roomId}:recent_messages`, JSON.stringify(message));
        await redis.lTrim(`room:${roomId}:recent_messages`, 0, 49); // Keep last 50 messages

        // Update room's updatedAt timestamp
        await prisma.room.update({
          where: { id: roomId },
          data: { updatedAt: new Date() }
        });

        // Broadcast message to all users in the room
        io.to(roomId).emit('message-received', message);

        console.log(`Message sent in room ${roomId} by ${username}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing-start', async (data: TypingData) => {
      if (socket.data.currentRoom === data.roomId && socket.data.username === data.username) {
        socket.to(data.roomId).emit('typing-update', { username: data.username, isTyping: true });
      }
    });

    socket.on('typing-stop', async (data: TypingData) => {
      if (socket.data.currentRoom === data.roomId && socket.data.username === data.username) {
        socket.to(data.roomId).emit('typing-update', { username: data.username, isTyping: false });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.id}`);
      
      if (socket.data.currentRoom && socket.data.username) {
        await leaveRoom(socket, socket.data.currentRoom, io);
      }

      // Clean up Redis data
      await redis.del(`user:${socket.id}`);
    });
  });
}

// Helper function to handle leaving a room
async function leaveRoom(socket: TypedSocket, roomId: string, io: TypedServer) {
  try {
    socket.leave(roomId);

    if (socket.data.userId && socket.data.username) {
      // Remove user from Redis room set
      await redis.sRem(`room:${roomId}:users`, socket.data.userId);

      // Notify other users
      socket.to(roomId).emit('user-left', { 
        username: socket.data.username, 
        roomId 
      });

      // Send updated user list  
      await sendRoomUserList(io, roomId);

      console.log(`User ${socket.data.username} left room ${roomId}`);
    }

    // Clear socket data
    socket.data.currentRoom = undefined;
  } catch (error) {
    console.error('Error leaving room:', error);
  }
}

// Helper function to send updated user list to room
async function sendRoomUserList(io: TypedServer, roomId: string) {
  try {
    const onlineUserIds = await redis.sMembers(`room:${roomId}:users`);
    
    if (onlineUserIds.length === 0) {
      io.to(roomId).emit('room-users-updated', []);
      return;
    }

    const users = await prisma.user.findMany({
      where: {
        id: { in: onlineUserIds }
      },
      select: {
        id: true,
        username: true,
        lastSeen: true
      }
    });

    io.to(roomId).emit('room-users-updated', users);
  } catch (error) {
    console.error('Error sending room user list:', error);
  }
}
