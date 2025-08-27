# 🎨 Livewire Chat Frontend

> **Modern, responsive real-time chat interface built with Next.js, TypeScript, and Tailwind CSS**

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)

## ✨ Features

### 🎯 **Real-time Experience**
- **Instant messaging** with Socket.IO WebSocket connections
- **Live typing indicators** showing when users are typing
- **Real-time user presence** with online/offline status
- **Automatic reconnection** with connection status indicators
- **Optimistic UI updates** for immediate feedback

### 🎨 **Modern UI/UX**
- **Sleek dark theme** with glassmorphism effects
- **Responsive design** that works on desktop, tablet, and mobile
- **Smooth animations** and transitions for delightful interactions
- **Accessibility-first** components with proper ARIA labels
- **Keyboard shortcuts** (Enter to send, Escape to close modals)

### 🏠 **Room Management**
- **Room lobby** with live room previews and user counts
- **Create rooms** with unique names and descriptions
- **Join/leave rooms** with smooth transitions
- **Message history** with automatic scrolling to latest messages
- **Online user lists** showing who's currently in each room

### 📱 **Mobile-First Design**
- **Touch-friendly** interface optimized for mobile devices
- **Responsive breakpoints** for all screen sizes
- **Progressive Web App** capabilities
- **Optimized performance** with Next.js 14 and Turbopack

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Architecture                │
├─────────────────────────────────────────────────────────┤
│  Next.js App Router                                     │
│  ├── app/                   # App Router pages          │
│  ├── components/            # React components          │
│  ├── contexts/              # Global state management   │
│  ├── lib/                   # Utilities & services      │
│  └── types/                 # TypeScript definitions    │
├─────────────────────────────────────────────────────────┤
│  State Management                                       │
│  ├── ChatContext            # Global chat state         │
│  ├── Socket.IO Client       # Real-time communication   │
│  └── API Service            # HTTP requests             │
├─────────────────────────────────────────────────────────┤
│  Styling & UI                                           │
│  ├── Tailwind CSS           # Utility-first styling     │
│  ├── Headless UI            # Accessible components     │
│  ├── Heroicons              # Beautiful icons           │
│  └── Custom Components      # Reusable UI elements      │
└─────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- **Node.js** 16.x or higher
- **npm** or **yarn**
- **Backend server** running on port 5000

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the frontend directory:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000` 🚀

## 🎯 User Journey

### 1. **Username Setup**
- Clean, welcoming interface for username entry
- Real-time validation and feedback
- Smooth transition to chat lobby

### 2. **Chat Lobby**
- Grid view of available chat rooms
- Live preview of last messages and timestamps
- Online user counts for each room
- Easy room creation with modal interface

### 3. **Chat Experience**
- Real-time messaging with instant delivery
- Typing indicators for enhanced communication
- Online user sidebar showing room participants
- Message history with timestamps and user attribution
- Smooth animations and transitions

### 4. **Responsive Design**
- Seamless experience across all devices
- Touch-optimized for mobile users
- Adaptive layouts for different screen sizes

## 🎨 Design System

### **Color Palette**
```css
/* Dark Theme */
--bg-primary: #111827      /* Gray-900 */
--bg-secondary: #1f2937    /* Gray-800 */
--bg-tertiary: #374151     /* Gray-700 */
--text-primary: #f9fafb    /* Gray-50 */
--text-secondary: #d1d5db  /* Gray-300 */
--accent-primary: #3b82f6  /* Blue-500 */
--accent-secondary: #8b5cf6 /* Purple-500 */
```

### **Typography**
```css
/* Font Stack */
--font-sans: 'Geist', system-ui, sans-serif
--font-mono: 'Geist Mono', 'Fira Code', monospace

/* Font Sizes */
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
```

### **Spacing & Layout**
```css
/* Spacing Scale */
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout component
│   │   └── page.tsx             # Home page
│   ├── components/              # React components
│   │   ├── ChatRoom.tsx         # Main chat interface
│   │   ├── CreateRoomModal.tsx  # Room creation modal
│   │   ├── RoomList.tsx         # Chat room lobby
│   │   └── UsernameSetup.tsx    # Username entry screen
│   ├── contexts/                # React Context providers
│   │   └── ChatContext.tsx      # Global chat state management
│   ├── lib/                     # Utility libraries
│   │   ├── api.ts               # HTTP API service
│   │   └── socket.ts            # Socket.IO client service
│   └── types/                   # TypeScript definitions
│       └── index.ts             # Shared type definitions
├── public/                      # Static assets
├── .env.local                   # Environment variables (create this)
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## 🧩 Component Architecture

### **ChatContext** (Global State)
```typescript
interface ChatState {
  // User state
  username: string | null
  currentRoom: Room | null
  
  // Data state
  rooms: Room[]
  messages: Message[]
  onlineUsers: User[]
  typingUsers: string[]
  
  // UI state
  showCreateRoomModal: boolean
  connectionStatus: ConnectionStatus
  loadingMessages: boolean
}
```

### **Key Components**

#### **UsernameSetup**
- Clean form interface for username entry
- Real-time validation and error handling
- Smooth transition animations

#### **RoomList** 
- Grid layout of available chat rooms
- Live data updates with room metadata
- Room creation and navigation

#### **ChatRoom**
- Real-time messaging interface
- User presence and typing indicators
- Message history with pagination
- Mobile-optimized layout

#### **CreateRoomModal**
- Accessible modal with form validation
- Real-time feedback and error handling
- Smooth open/close animations

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run type-check` | Run TypeScript type checking |

## 🎨 Styling Approach

### **Tailwind CSS Utilities**
```tsx
// Example component styling
<div className="
  bg-gray-800/80           // Semi-transparent background
  backdrop-blur-sm         // Glassmorphism effect
  border border-gray-700/50 // Subtle border
  rounded-2xl              // Rounded corners
  shadow-2xl               // Drop shadow
  p-6                      // Padding
  transition-all           // Smooth transitions
  duration-200             // Animation timing
  hover:bg-gray-800/90     // Hover effects
">
```

### **Responsive Breakpoints**
```css
/* Mobile First Approach */
.container {
  @apply px-4;                    /* Mobile: 16px padding */
  @apply sm:px-6;                 /* Small: 24px padding */
  @apply lg:px-8;                 /* Large: 32px padding */
}

/* Breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

## ⚡ Performance Optimizations

- **Next.js 14** with App Router for optimal performance
- **Turbopack** for lightning-fast development builds
- **Code splitting** with dynamic imports
- **Image optimization** with Next.js Image component
- **Font optimization** with next/font
- **Bundle analysis** and optimization

## 🔌 API Integration

### **HTTP API Service**
```typescript
class ApiService {
  async getRooms(): Promise<Room[]>
  async createRoom(data: CreateRoomData): Promise<Room>
  async getMessages(roomId: string, page?: number): Promise<MessageResponse>
}
```

### **Socket.IO Integration**
```typescript
class SocketService {
  connect(username: string): void
  joinRoom(roomId: string, username: string): void
  sendMessage(data: SendMessageData): void
  startTyping(roomId: string, username: string): void
  stopTyping(roomId: string, username: string): void
}
```

## 📱 Mobile Optimization

### **Touch Interactions**
- Large touch targets (minimum 44px)
- Swipe gestures for navigation
- Pull-to-refresh functionality
- Touch-friendly form controls

### **Performance**
- Lazy loading for optimal bundle size
- Efficient re-rendering with React optimization
- Minimal JavaScript for core functionality
- Progressive enhancement approach

## 🎯 Accessibility Features

- **Semantic HTML** with proper heading hierarchy
- **ARIA labels** and descriptions for screen readers
- **Keyboard navigation** support throughout the app
- **High contrast** color scheme for better visibility
- **Focus management** for modal interactions
- **Screen reader** announcements for dynamic content

## 🔧 Development

### **Hot Reload Development**
```bash
npm run dev
```
- Instant updates on file changes
- TypeScript error reporting
- Tailwind CSS compilation
- Socket.IO connection maintenance

### **Building for Production**
```bash
npm run build
npm run start
```

### **Code Quality**
```bash
npm run lint        # ESLint
npm run type-check  # TypeScript
```

## 🚀 Deployment

### **Environment Variables for Production**
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_SERVER_URL=https://your-api-domain.com
```

### **Deployment Platforms**
- **Vercel** (✅ Perfect for Next.js frontend)
- **Netlify** (✅ Good alternative for static sites)
- **AWS Amplify** (✅ Full AWS integration)
- **Docker** with nginx (✅ Self-hosted option)

**⚠️ Important**: This frontend connects to a **WebSocket backend** that **cannot** be deployed on Vercel. Deploy the backend on Railway/Render and update the environment variables accordingly.

## 🐛 Troubleshooting

### **Common Issues**

**WebSocket Connection Failed**
```bash
# Check backend server is running
curl http://localhost:5000/api/health

# Verify environment variables
cat .env.local
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Styling Issues**
```bash
# Rebuild Tailwind CSS
npm run dev
```

## 🎨 Customization

### **Theme Customization**
Edit `tailwind.config.ts` to customize the design system:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Custom color palette
        primary: {...},
        secondary: {...}
      },
      fontFamily: {
        // Custom fonts
        sans: ['Custom Font', ...defaultTheme.fontFamily.sans]
      }
    }
  }
}
```

### **Component Customization**
All components are built with Tailwind utilities, making customization straightforward:

```tsx
// Easy to modify styles
<Button className="bg-blue-600 hover:bg-blue-700 text-white">
  Custom Button
</Button>
```

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

**Crafted with ❤️ for an exceptional real-time chat experience**