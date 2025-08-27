import { Router } from 'express';
import { prisma, redis } from '../index';
import { CreateRoomData, Room, Message } from '../types';

const router = Router();

// GET /rooms - Get all chat rooms with last message and online count
router.get('/', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { username: true }
            }
          }
        },
        _count: {
          select: { userRooms: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Get online user counts from Redis
    const roomsWithOnlineCount = await Promise.all(
      rooms.map(async (room) => {
        const onlineUsers = await redis.sMembers(`room:${room.id}:users`);
        return {
          id: room.id,
          name: room.name,
          description: room.description,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
          onlineCount: onlineUsers.length,
          lastMessage: room.messages[0] ? {
            content: room.messages[0].content,
            createdAt: room.messages[0].createdAt,
            username: room.messages[0].user.username
          } : null
        };
      })
    );

    res.json(roomsWithOnlineCount);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// POST /rooms - Create new chat room
router.post('/', async (req, res) => {
  try {
    const { name, description }: CreateRoomData = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    // Check if room name already exists
    const existingRoom = await prisma.room.findUnique({
      where: { name: name.trim() }
    });

    if (existingRoom) {
      return res.status(409).json({ error: 'Room name already exists' });
    }

    const room = await prisma.room.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null
      }
    });

    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// GET /rooms/:id/messages - Get message history for a room
router.get('/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: { id }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const messages = await prisma.message.findMany({
      where: { roomId: id },
      include: {
        user: {
          select: { username: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Reverse to get chronological order (oldest first)
    const chronologicalMessages = messages.reverse();

    res.json({
      messages: chronologicalMessages,
      page,
      hasMore: messages.length === limit
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// GET /rooms/:id/users - Get online users in a room
router.get('/:id/users', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: { id }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Get online users from Redis
    const onlineUserIds = await redis.sMembers(`room:${id}:users`);
    
    if (onlineUserIds.length === 0) {
      return res.json([]);
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

    res.json(users);
  } catch (error) {
    console.error('Error fetching room users:', error);
    res.status(500).json({ error: 'Failed to fetch room users' });
  }
});

export default router;
