'use client';

import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useChat } from '@/contexts/ChatContext';
import { 
  ArrowLeftIcon, 
  PaperAirplaneIcon, 
  UsersIcon,
  SignalIcon,
  SignalSlashIcon 
} from '@heroicons/react/24/outline';

export default function ChatRoom() {
  const { state, leaveRoom, sendMessage, startTyping, stopTyping } = useChat();
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const { currentRoom, messages, onlineUsers, typingUsers, connectionStatus, username } = state;

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    sendMessage(messageInput);
    setMessageInput('');
    handleStopTyping();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      startTyping();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      stopTyping();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  if (!currentRoom) {
    return null;
  }

  const filteredTypingUsers = typingUsers.filter(user => user !== username);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={leaveRoom}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-white">{currentRoom.name}</h1>
            {currentRoom.description && (
              <p className="text-sm text-gray-400">{currentRoom.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2 text-sm">
            {connectionStatus.connected ? (
              <>
                <SignalIcon className="w-4 h-4 text-green-400" />
                <span className="text-green-400 hidden sm:inline">Connected</span>
              </>
            ) : connectionStatus.reconnecting ? (
              <>
                <SignalSlashIcon className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="text-yellow-400 hidden sm:inline">Reconnecting...</span>
              </>
            ) : (
              <>
                <SignalSlashIcon className="w-4 h-4 text-red-400" />
                <span className="text-red-400 hidden sm:inline">Disconnected</span>
              </>
            )}
          </div>

          {/* Online Users Count */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <UsersIcon className="w-4 h-4" />
            <span>{onlineUsers.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {state.loadingMessages ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-400 mt-2">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-2">No messages yet</p>
                <p className="text-sm text-gray-500">Be the first to say something!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.user.username === username ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-2 shadow-lg ${
                      message.user.username === username
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 text-gray-100'
                    }`}
                  >
                    {message.user.username !== username && (
                      <p className="text-xs font-medium mb-1 text-blue-400">
                        {message.user.username}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.user.username === username
                          ? 'text-blue-100'
                          : 'text-gray-400'
                      }`}
                    >
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Typing Indicators */}
            {filteredTypingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-4 py-2">
                  <p className="text-xs text-gray-400 mb-1">
                    {filteredTypingUsers.length === 1
                      ? `${filteredTypingUsers[0]} is typing...`
                      : `${filteredTypingUsers.join(', ')} are typing...`}
                  </p>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm p-4">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={messageInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-white placeholder-gray-400"
                disabled={!connectionStatus.connected}
                maxLength={1000}
              />
              <button
                type="submit"
                disabled={!messageInput.trim() || !connectionStatus.connected}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Online Users Sidebar */}
        <div className="w-64 border-l border-gray-700/50 bg-gray-800/50 backdrop-blur-sm p-4 hidden lg:block">
          <h3 className="text-sm font-medium text-white mb-4">
            Online Users ({onlineUsers.length})
          </h3>
          <div className="space-y-2">
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.username}
                    {user.username === username && (
                      <span className="text-xs text-gray-400 ml-1">(you)</span>
                    )}
                  </p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
