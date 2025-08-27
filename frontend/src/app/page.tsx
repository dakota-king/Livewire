'use client';

import { useChat } from '@/contexts/ChatContext';
import UsernameSetup from '@/components/UsernameSetup';
import RoomList from '@/components/RoomList';
import ChatRoom from '@/components/ChatRoom';
import CreateRoomModal from '@/components/CreateRoomModal';

export default function Home() {
  const { state } = useChat();

  // Show username setup if no username is set
  if (!state.username) {
    return <UsernameSetup />;
  }

  // Show chat room if user is in a room
  if (state.currentRoom) {
    return (
      <>
        <ChatRoom />
        <CreateRoomModal />
      </>
    );
  }

  // Show room list (lobby) by default
  return (
    <>
      <RoomList />
      <CreateRoomModal />
    </>
  );
}