# Livewire Chat Frontend

A modern, responsive real-time chat application frontend built with Next.js, TypeScript, Tailwind CSS, and Socket.IO.

## Features

- **Real-time messaging** with instant message delivery
- **Room-based chat system** with easy room switching
- **Username-based authentication** (no complex signup required)
- **Typing indicators** showing when users are typing
- **Online user presence** with live user lists
- **Responsive design** that works on desktop, tablet, and mobile
- **Connection status indicators** showing connection health
- **Message history** with pagination support
- **Create room modal** for easy room creation
- **Modern UI/UX** with smooth animations and transitions

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time communication
- **Headless UI** for accessible UI components
- **Heroicons** for beautiful icons
- **date-fns** for date formatting
- **React Context** for state management

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend server running (see backend README)

## Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SERVER_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Application Flow

### 1. Username Setup
- Users enter a username when first visiting the app
- Username is stored in React context for the session
- No complex authentication required

### 2. Lobby/Room List
- Displays all available chat rooms
- Shows room metadata: name, description, online count, last message
- Allows creating new rooms
- Click any room to join

### 3. Chat Room
- Real-time messaging interface
- Message history loads automatically
- Online users sidebar (desktop) showing active participants
- Typing indicators when users are typing
- Connection status indicator
- Leave room to return to lobby

### 4. Create Room Modal
- Simple form to create new rooms
- Room name (required) and description (optional)
- Automatically joins the new room after creation

## Component Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with ChatProvider
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── UsernameSetup.tsx  # Username input screen
│   ├── RoomList.tsx       # Lobby with room cards
│   ├── ChatRoom.tsx       # Chat interface
│   └── CreateRoomModal.tsx # Room creation modal
├── contexts/              # React Context
│   └── ChatContext.tsx    # Main chat state management
├── lib/                   # Utility libraries
│   ├── socket.ts          # Socket.IO client service
│   └── api.ts             # REST API client
└── types/                 # TypeScript definitions
    └── index.ts           # Shared type definitions
```

## State Management

The app uses React Context for state management with the following structure:

### Chat State
```typescript
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
```

### Actions
- `setUsername(username: string)` - Set user's username
- `joinRoom(room: Room)` - Join a chat room
- `leaveRoom()` - Leave current room
- `sendMessage(content: string)` - Send a message
- `createRoom(data)` - Create a new room
- `loadRooms()` - Refresh room list
- `startTyping()` / `stopTyping()` - Typing indicators

## Socket.IO Integration

### Connection Management
- Automatic connection on app load
- Reconnection handling with visual indicators
- Connection status updates in UI
- Graceful error handling

### Real-time Events
- **Message receiving** - Instant message updates
- **User presence** - Join/leave notifications
- **Typing indicators** - Real-time typing status
- **Room updates** - Online user count changes

### Client Events
```typescript
// Join a room
socket.emit('join-room', { roomId, username });

// Send a message
socket.emit('send-message', { roomId, content, username });

// Typing indicators
socket.emit('typing-start', { roomId, username, isTyping: true });
socket.emit('typing-stop', { roomId, username, isTyping: false });
```

## Styling & Design

### Tailwind CSS
- Utility-first CSS framework
- Responsive design with mobile-first approach
- Custom color palette and spacing
- Dark mode support (can be extended)

### Design System
- **Colors**: Blue primary, gray neutrals
- **Typography**: Clean, readable font stack
- **Spacing**: Consistent spacing scale
- **Components**: Reusable component patterns

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Performance Optimizations

### React Optimizations
- **useCallback** and **useMemo** for expensive operations
- **Optimistic UI updates** for better perceived performance
- **Efficient re-renders** with proper state structure

### Network Optimizations
- **Connection pooling** with Socket.IO
- **Message caching** to reduce API calls
- **Debounced typing indicators** to reduce network traffic

### User Experience
- **Loading states** for all async operations
- **Error boundaries** for graceful error handling
- **Smooth animations** with CSS transitions
- **Keyboard shortcuts** (Enter to send messages)

## Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## Accessibility Features

- **Keyboard navigation** support
- **Screen reader** friendly markup
- **Focus management** for modals
- **ARIA labels** for interactive elements
- **Color contrast** compliance

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_SERVER_URL` | Socket.IO server URL | `http://localhost:5000` |

## Troubleshooting

### Connection Issues
- Check if backend server is running
- Verify environment variables are correct
- Check browser console for WebSocket errors

### Build Issues
- Clear `.next` folder and rebuild
- Check TypeScript errors
- Verify all dependencies are installed

### Performance Issues
- Check browser dev tools for performance bottlenecks
- Ensure backend Redis server is running
- Monitor network tab for excessive requests

## Development Tips

### Hot Reloading
- Changes to components update instantly
- Socket connections persist during development
- State is preserved when possible

### Debugging
- React DevTools for component inspection
- Browser DevTools for network monitoring
- Console logs for Socket.IO events

### Testing
- Use multiple browser tabs to test real-time features
- Test on different devices for responsive design
- Verify keyboard navigation works

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Test your changes thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.