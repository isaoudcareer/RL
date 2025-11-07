import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage } from '../types';

interface ChatState {
  messages: ChatMessage[];
  apiKey: string;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setApiKey: (key: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      apiKey: '',
      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };
        set((state) => ({ messages: [...state.messages, newMessage] }));
      },
      clearMessages: () => {
        set({ messages: [] });
      },
      setApiKey: (key) => {
        set({ apiKey: key });
      },
    }),
    {
      name: 'kiwiilove-chat',
    }
  )
);
