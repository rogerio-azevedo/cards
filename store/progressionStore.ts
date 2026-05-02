import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Card } from '../types/game';

interface ProgressionState {
  currentLevel: number;
  unlockedLevels: number[];
  inventory: string[]; // Card IDs
  playerXp: number;
  assignedDeck: string[]; // List of card IDs in the player's current deck
  
  unlockLevel: (level: number) => void;
  addCardToInventory: (cardId: string) => void;
  updateXp: (amount: number) => void;
  setAssignedDeck: (cardIds: string[]) => void;
  resetProgress: () => void;
}

export const useProgressionStore = create<ProgressionState>()(
  persist(
    (set) => ({
      currentLevel: 1,
      unlockedLevels: [1],
      inventory: [], 
      playerXp: 0,
      assignedDeck: [],

      unlockLevel: (level) => set((state) => ({
        unlockedLevels: state.unlockedLevels.includes(level) 
          ? state.unlockedLevels 
          : [...state.unlockedLevels, level]
      })),

      addCardToInventory: (cardId) => set((state) => ({
        inventory: [...state.inventory, cardId]
      })),

      updateXp: (amount) => set((state) => ({
        playerXp: state.playerXp + amount
      })),

      setAssignedDeck: (cardIds) => set({ assignedDeck: cardIds }),

      resetProgress: () => set({ 
        currentLevel: 1, 
        unlockedLevels: [1], 
        inventory: [],
        playerXp: 0,
        assignedDeck: []
      })
    }),
    {
      name: 'solar-balls-progress', // localStorage key
    }
  )
);
