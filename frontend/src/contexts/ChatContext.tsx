'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Room, Message, User, ConnectionStatus } from '@/types';
import socketService from '@/lib/socket';
import apiService from '@/lib/api';

interface ChatState {
  // User state
  username: string;
  currentRoom: Room | null;
  
  // Rooms state
  rooms: Room[];
  
  // Messages state
  messages: Message[];
  loadingMessages: boolean;
  
  // Users state
  onlineUsers: User[];
  
  // Typing indicators
  typingUsers: string[];
  
  // Connection state
  connectionStatus: ConnectionStatus;
  
  // UI state
  showCreateRoomModal: boolean;
}

type ChatAction =
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_CURRENT_ROOM'; payload: Room | null }
  | { type: 'SET_ROOMS'; payload: Room[] }
  | { type: 'ADD_ROOM'; payload: Room }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING_MESSAGES'; payload: boolean }
  | { type: 'SET_ONLINE_USERS'; payload: User[] }
  | { type: 'SET_TYPING_USERS'; payload: string[] }
  | { type: 'ADD_TYPING_USER'; payload: string }
  | { type: 'REMOVE_TYPING_USER'; payload: string }
  | { type: 'SET_CONNECTION_STATUS'; payload: ConnectionStatus }
  | { type: 'TOGGLE_CREATE_ROOM_MODAL' };

const initialState: ChatState = {
  username: '',
  currentRoom: null,
  rooms: [],
  messages: [],
  loadingMessages: false,
  onlineUsers: [],
  typingUsers: [],
  connectionStatus: { connected: false, reconnecting: false },
  showCreateRoomModal: false,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    
    case 'SET_CURRENT_ROOM':
      return { ...state, currentRoom: action.payload, messages: [], typingUsers: [] };
    
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload };
    
    case 'ADD_ROOM':
      return { ...state, rooms: [action.payload, ...state.rooms] };
    
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    
    case 'SET_LOADING_MESSAGES':
      return { ...state, loadingMessages: action.payload };
    
    case 'SET_ONLINE_USERS':
      return { ...state, onlineUsers: action.payload };
    
    case 'SET_TYPING_USERS':
      return { ...state, typingUsers: action.payload };
    
    case 'ADD_TYPING_USER':
      if (!state.typingUsers.includes(action.payload)) {
        return { ...state, typingUsers: [...state.typingUsers, action.payload] };
      }
      return state;
    
    case 'REMOVE_TYPING_USER':
      return { 
        ...state, 
        typingUsers: state.typingUsers.filter(user => user !== action.payload) 
      };
    
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    
    case 'TOGGLE_CREATE_ROOM_MODAL':
      return { ...state, showCreateRoomModal: !state.showCreateRoomModal };
    
    default:
      return state;
  }
}

interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  // Actions
  setUsername: (username: string) => void;
  joinRoom: (room: Room) => void;
  leaveRoom: () => void;
  sendMessage: (content: string) => void;
  createRoom: (data: { name: string; description?: string }) => Promise<void>;
  loadRooms: () => Promise<void>;
  loadMessages: () => Promise<void>;
  startTyping: () => void;
  stopTyping: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Initialize socket connection
  useEffect(() => {
    const socket = socketService.connect();
    
    // Connection status listeners
    socket.on('connect', () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: { connected: true, reconnecting: false } });
    });

    socket.on('disconnect', () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: { connected: false, reconnecting: false } });
    });

    socket.on('reconnecting', () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: { connected: false, reconnecting: true } });
    });

    // Message listeners
    socketService.onMessageReceived((message) => {
      dispatch({ type: 'ADD_MESSAGE', payload: message });
    });

    socketService.onUserJoined((data) => {
      // You could show a notification here
      console.log(`${data.username} joined the room`);
    });

    socketService.onUserLeft((data) => {
      // You could show a notification here
      console.log(`${data.username} left the room`);
    });

    socketService.onTypingUpdate((data) => {
      if (data.isTyping) {
        dispatch({ type: 'ADD_TYPING_USER', payload: data.username });
      } else {
        dispatch({ type: 'REMOVE_TYPING_USER', payload: data.username });
      }
    });

    socketService.onRoomUsersUpdated((users) => {
      dispatch({ type: 'SET_ONLINE_USERS', payload: users });
    });

    socketService.onError((error) => {
      console.error('Socket error:', error.message);
      dispatch({ 
        type: 'SET_CONNECTION_STATUS', 
        payload: { connected: false, reconnecting: false, error: error.message } 
      });
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Actions
  const setUsername = (username: string) => {
    dispatch({ type: 'SET_USERNAME', payload: username });
  };

  const joinRoom = async (room: Room) => {
    if (!state.username) return;
    
    dispatch({ type: 'SET_CURRENT_ROOM', payload: room });
    socketService.joinRoom(room.id, state.username);
    
    // Load message history
    await loadMessages();
  };

  const leaveRoom = () => {
    if (state.currentRoom) {
      socketService.leaveRoom(state.currentRoom.id);
      dispatch({ type: 'SET_CURRENT_ROOM', payload: null });
    }
  };

  const sendMessage = (content: string) => {
    if (!state.currentRoom || !state.username || !content.trim()) return;
    
    socketService.sendMessage(state.currentRoom.id, content.trim(), state.username);
  };

  const createRoom = async (data: { name: string; description?: string }) => {
    try {
      const newRoom = await apiService.createRoom(data);
      dispatch({ type: 'ADD_ROOM', payload: newRoom });
      dispatch({ type: 'TOGGLE_CREATE_ROOM_MODAL' });
      
      // Automatically join the new room
      await joinRoom(newRoom);
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  };

  const loadRooms = async () => {
    try {
      const rooms = await apiService.getRooms();
      dispatch({ type: 'SET_ROOMS', payload: rooms });
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  const loadMessages = async () => {
    if (!state.currentRoom) return;
    
    try {
      dispatch({ type: 'SET_LOADING_MESSAGES', payload: true });
      const { messages } = await apiService.getRoomMessages(state.currentRoom.id);
      dispatch({ type: 'SET_MESSAGES', payload: messages });
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      dispatch({ type: 'SET_LOADING_MESSAGES', payload: false });
    }
  };

  const startTyping = () => {
    if (state.currentRoom && state.username) {
      socketService.startTyping(state.currentRoom.id, state.username);
    }
  };

  const stopTyping = () => {
    if (state.currentRoom && state.username) {
      socketService.stopTyping(state.currentRoom.id, state.username);
    }
  };

  const value: ChatContextType = {
    state,
    dispatch,
    setUsername,
    joinRoom,
    leaveRoom,
    sendMessage,
    createRoom,
    loadRooms,
    loadMessages,
    startTyping,
    stopTyping,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
