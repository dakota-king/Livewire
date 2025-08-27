'use client';

import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useChat } from '@/contexts/ChatContext';
import { Room } from '@/types';
import { 
  UsersIcon, 
  ChatBubbleLeftIcon, 
  PlusIcon,
  SignalIcon,
  SignalSlashIcon 
} from '@heroicons/react/24/outline';

export default function RoomList() {
  const { state, loadRooms, joinRoom, dispatch } = useChat();
  const { rooms, connectionStatus } = state;

  useEffect(() => {
    loadRooms();
    
    // Refresh rooms every 30 seconds
    const interval = setInterval(loadRooms, 30000);
    return () => clearInterval(interval);
  }, [loadRooms]);

  const handleRoomClick = (room: Room) => {
    joinRoom(room);
  };

  const handleCreateRoom = () => {
    dispatch({ type: 'TOGGLE_CREATE_ROOM_MODAL' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Livewire Chat</h1>
          <p className="text-gray-400 mb-4">Join a room to start chatting with others</p>
          
          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2 text-sm">
            {connectionStatus.connected ? (
              <>
                <SignalIcon className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Connected</span>
              </>
            ) : connectionStatus.reconnecting ? (
              <>
                <SignalSlashIcon className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="text-yellow-400">Reconnecting...</span>
              </>
            ) : (
              <>
                <SignalSlashIcon className="w-4 h-4 text-red-400" />
                <span className="text-red-400">Disconnected</span>
              </>
            )}
          </div>
        </div>

        {/* User Info & Create Room Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2 shadow-sm">
            <span className="text-sm text-gray-400">Logged in as: </span>
            <span className="font-medium text-white">{state.username}</span>
          </div>
          
          <button
            onClick={handleCreateRoom}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="w-5 h-5" />
            Create Room
          </button>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ChatBubbleLeftIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No rooms yet</h3>
              <p className="text-gray-400 mb-4">Be the first to create a chat room!</p>
              <button
                onClick={handleCreateRoom}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Create First Room
              </button>
            </div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room)}
                className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-800/80 transition-all duration-200 cursor-pointer p-6 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white truncate pr-2 group-hover:text-blue-400 transition-colors">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-400 flex-shrink-0">
                    <UsersIcon className="w-4 h-4" />
                    <span>{room.onlineCount || 0}</span>
                  </div>
                </div>

                {room.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {room.description}
                  </p>
                )}

                {room.lastMessage ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300 bg-gray-700/50 rounded-lg p-3 border border-gray-600/30">
                      <span className="font-medium text-blue-400">
                        {room.lastMessage.username}:
                      </span>{' '}
                      <span className="line-clamp-1">{room.lastMessage.content}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(room.lastMessage.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    No messages yet - be the first to say hello!
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
