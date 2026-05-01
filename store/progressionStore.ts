import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Card } from '../types/game';

interface ProgressionState {
  currentLevel: number;
  unlockedLevels: number[];
  inventory: string[]; // Card IDs
  
  unlockLevel: (level: number) => void;
  addCardToInventory: (cardId: string) => void;
  resetProgress: () => void;
}

export const useProgressionStore = create<ProgressionState>()(
  persist(
    (set) => ({
      currentLevel: 1,
      unlockedLevels: [1],
      inventory: [], // IDs of cards the player owns beyond the starter deck

      unlockLevel: (level) => set((state) => ({
        unlockedLevels: state.unlockedLevels.includes(level) 
          ? state.unlockedLevels 
          : [...state.unlockedLevels, level]
      })),

      addCardToInventory: (cardId) => set((state) => ({
        inventory: [...state.inventory, cardId]
      })),

      resetProgress: () => set({ currentLevel: 1, unlockedLevels: [1], inventory: [] })
    }),
    {
      name: 'solar-balls-progress', // localStorage key
    }
  )
);
