import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '@/types';

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(serverUrl: string = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000') {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(serverUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: this.maxReconnectAttempts,
      timeout: 20000,
      transports: ['websocket', 'polling']
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected after', attemptNumber, 'attempts');
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Failed to reconnect after', this.maxReconnectAttempts, 'attempts');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  // Room methods
  joinRoom(roomId: string, username: string) {
    if (this.socket) {
      this.socket.emit('join-room', { roomId, username });
    }
  }

  leaveRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('leave-room', { roomId });
    }
  }

  // Message methods
  sendMessage(roomId: string, content: string, username: string) {
    if (this.socket) {
      this.socket.emit('send-message', { roomId, content, username });
    }
  }

  // Typing methods
  startTyping(roomId: string, username: string) {
    if (this.socket) {
      this.socket.emit('typing-start', { roomId, username, isTyping: true });
    }
  }

  stopTyping(roomId: string, username: string) {
    if (this.socket) {
      this.socket.emit('typing-stop', { roomId, username, isTyping: false });
    }
  }

  // Event listeners
  onMessageReceived(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('message-received', callback);
    }
  }

  onUserJoined(callback: (data: { username: string; roomId: string }) => void) {
    if (this.socket) {
      this.socket.on('user-joined', callback);
    }
  }

  onUserLeft(callback: (data: { username: string; roomId: string }) => void) {
    if (this.socket) {
      this.socket.on('user-left', callback);
    }
  }

  onTypingUpdate(callback: (data: { username: string; isTyping: boolean }) => void) {
    if (this.socket) {
      this.socket.on('typing-update', callback);
    }
  }

  onRoomUsersUpdated(callback: (users: any[]) => void) {
    if (this.socket) {
      this.socket.on('room-users-updated', callback);
    }
  }

  onError(callback: (error: { message: string }) => void) {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }

  // Remove listeners
  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketService = new SocketService();
export default socketService;
