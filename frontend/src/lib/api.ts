import { Room, Message, CreateRoomData } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Room endpoints
  async getRooms(): Promise<Room[]> {
    return this.request<Room[]>('/rooms');
  }

  async createRoom(data: CreateRoomData): Promise<Room> {
    return this.request<Room>('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRoomMessages(
    roomId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{
    messages: Message[];
    page: number;
    hasMore: boolean;
  }> {
    return this.request<{
      messages: Message[];
      page: number;
      hasMore: boolean;
    }>(`/rooms/${roomId}/messages?page=${page}&limit=${limit}`);
  }

  async getRoomUsers(roomId: string) {
    return this.request(`/rooms/${roomId}/users`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
