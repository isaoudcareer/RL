import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppView } from '../types';

interface AppState {
  currentView: AppView;
  setView: (view: AppView) => void;
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: 'notes',
      setView: (view) => set({ currentView: view }),
      selectedNoteId: null,
      setSelectedNoteId: (id) => set({ selectedNoteId: id }),
    }),
    {
      name: 'kiwiilove-app',
    }
  )
);
