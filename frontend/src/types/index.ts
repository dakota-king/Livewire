export interface User {
  id: string;
  username: string;
  lastSeen: Date;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  onlineCount?: number;
  lastMessage?: {
    content: string;
    createdAt: Date;
    username: string;
  } | null;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  roomId: string;
  createdAt: Date;
  user: {
    username: string;
  };
}

export interface CreateRoomData {
  name: string;
  description?: string;
}

export interface JoinRoomData {
  roomId: string;
  username: string;
}

export interface SendMessageData {
  roomId: string;
  content: string;
  username: string;
}

export interface TypingData {
  roomId: string;
  username: string;
  isTyping: boolean;
}

// Socket.IO event types
export interface ServerToClientEvents {
  'message-received': (message: Message) => void;
  'user-joined': (data: { username: string; roomId: string }) => void;
  'user-left': (data: { username: string; roomId: string }) => void;
  'typing-update': (data: { username: string; isTyping: boolean }) => void;
  'room-users-updated': (users: User[]) => void;
  'error': (error: { message: string }) => void;
}

export interface ClientToServerEvents {
  'join-room': (data: JoinRoomData) => void;
  'leave-room': (data: { roomId: string }) => void;
  'send-message': (data: SendMessageData) => void;
  'typing-start': (data: TypingData) => void;
  'typing-stop': (data: TypingData) => void;
}

export interface ConnectionStatus {
  connected: boolean;
  reconnecting: boolean;
  error?: string;
}
