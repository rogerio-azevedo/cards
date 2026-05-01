import { create } from 'zustand';
import { Card, GameCard, BoardPosition, CreatureCard } from '../types/game';
import { cardCatalog } from '../data/cards';

export type GamePhase = 'Anomaly' | 'Main' | 'End'; // Combat is part of Main phase for now
export type PlayerTurn = 'Player' | 'Opponent';

export interface FieldSlots {
  attack: Record<number, GameCard | null>;
  defense: Record<number, GameCard | null>;
  anomalies: GameCard[];
}

interface GameState {
  playerDeck: Card[];
  opponentDeck: Card[];
  playerHand: GameCard[];
  opponentHand: GameCard[];
  playerField: FieldSlots;
  opponentField: FieldSlots;
  currentTurn: PlayerTurn;
  phase: GamePhase;
  
  selectedCardIdFromHand: string | null;
  sacrificeSelection: string[];
  
  // Combat State
  attackerCardId: string | null;
  cardsThatAttacked: string[]; // Resets every turn
  
  startGame: (playerDeck: Card[], opponentDeck: Card[]) => void;
  drawCard: (player: PlayerTurn, count?: number) => void;
  selectCardFromHand: (instanceId: string | null) => void;
  toggleSacrificeSelection: (instanceId: string) => void;
  playCardToField: (player: PlayerTurn, instanceId: string, slot: BoardPosition, mode: 'Attack' | 'Defense') => void;
  selectAttacker: (instanceId: string | null) => void;
  executeAttack: (targetInstanceId: string) => void;
  nextPhase: () => void;
  endTurn: () => void;
}

const createEmptyField = (): FieldSlots => ({
  attack: { 1: null, 2: null, 3: null, 4: null, 5: null },
  defense: { 1: null, 2: null, 3: null, 4: null, 5: null },
  anomalies: []
});

export const useGameStore = create<GameState>((set, get) => ({
  playerDeck: [],
  opponentDeck: [],
  playerHand: [],
  opponentHand: [],
  playerField: createEmptyField(),
  opponentField: createEmptyField(),
  currentTurn: 'Player',
  phase: 'Anomaly',
  selectedCardIdFromHand: null,
  sacrificeSelection: [],
  attackerCardId: null,
  cardsThatAttacked: [],

  startGame: (pDeck, oDeck) => {
    set({
      playerDeck: pDeck,
      opponentDeck: oDeck,
      playerHand: [],
      opponentHand: [],
      playerField: createEmptyField(),
      opponentField: createEmptyField(),
      currentTurn: 'Player',
      phase: 'Anomaly',
      selectedCardIdFromHand: null,
      sacrificeSelection: [],
      attackerCardId: null,
      cardsThatAttacked: []
    });
    get().drawCard('Player', 5);
    get().drawCard('Opponent', 5);
  },

  drawCard: (player, count = 1) => {
    set((state) => {
      const deckKey = player === 'Player' ? 'playerDeck' : 'opponentDeck';
      const handKey = player === 'Player' ? 'playerHand' : 'opponentHand';
      
      const deck = [...state[deckKey]];
      const hand = [...state[handKey]];
      
      for (let i = 0; i < count; i++) {
        if (deck.length > 0) {
          const drawnCard = deck.shift()!;
          const gameCard: GameCard = {
            instanceId: `${player}_${drawnCard.id}_${Date.now()}_${Math.random()}`,
            cardId: drawnCard.id
          };
          // Initialize currentDefense if it's a creature
          const catalogCard = cardCatalog.find(c => c.id === gameCard.cardId) as CreatureCard;
          if (catalogCard && catalogCard.defense) {
            gameCard.currentDefense = catalogCard.defense;
          }

          hand.push(gameCard);
        }
      }
      
      return { [deckKey]: deck, [handKey]: hand };
    });
  },

  selectCardFromHand: (instanceId) => {
    set({ selectedCardIdFromHand: instanceId, sacrificeSelection: [], attackerCardId: null });
  },

  toggleSacrificeSelection: (instanceId) => {
    set((state) => {
      const current = state.sacrificeSelection;
      if (current.includes(instanceId)) {
        return { sacrificeSelection: current.filter(id => id !== instanceId) };
      } else if (current.length < 3) {
        return { sacrificeSelection: [...current, instanceId] };
      }
      return state;
    });
  },

  playCardToField: (player, instanceId, slot, mode) => {
    set((state) => {
      const handKey = player === 'Player' ? 'playerHand' : 'opponentHand';
      const fieldKey = player === 'Player' ? 'playerField' : 'opponentField';
      
      const hand = [...state[handKey]];
      const cardIndex = hand.findIndex(c => c.instanceId === instanceId);
      
      if (cardIndex === -1) return state;
      
      const gameCard = hand[cardIndex];
      const catalogCard = cardCatalog.find(c => c.id === gameCard.cardId);
      if (!catalogCard) return state;

      const newField = { ...state[fieldKey] };
      const newAttack = { ...newField.attack };
      const newDefense = { ...newField.defense };
      
      if (state.sacrificeSelection.length > 0) {
        state.sacrificeSelection.forEach(sacId => {
          Object.keys(newAttack).forEach(s => {
            if (newAttack[Number(s)]?.instanceId === sacId) newAttack[Number(s)] = null;
          });
          Object.keys(newDefense).forEach(s => {
            if (newDefense[Number(s)]?.instanceId === sacId) newDefense[Number(s)] = null;
          });
        });
      }

      gameCard.position = slot;
      gameCard.mode = mode;
      
      if (mode === 'Attack') newAttack[slot] = gameCard;
      else newDefense[slot] = gameCard;
      
      newField.attack = newAttack;
      newField.defense = newDefense;
      hand.splice(cardIndex, 1);
      
      return { 
        [handKey]: hand, 
        [fieldKey]: newField,
        selectedCardIdFromHand: null,
        sacrificeSelection: []
      };
    });
  },

  selectAttacker: (instanceId) => {
    set({ attackerCardId: instanceId, selectedCardIdFromHand: null });
  },

  executeAttack: (targetInstanceId) => {
    set((state) => {
      if (!state.attackerCardId) return state;
      
      const isPlayerTurn = state.currentTurn === 'Player';
      const attackerField = isPlayerTurn ? { ...state.playerField } : { ...state.opponentField };
      const targetField = isPlayerTurn ? { ...state.opponentField } : { ...state.playerField };

      // Find attacker
      let attacker: GameCard | null = null;
      let attackerSlot: number = 0;
      Object.keys(attackerField.attack).forEach(s => {
        if (attackerField.attack[Number(s)]?.instanceId === state.attackerCardId) {
          attacker = attackerField.attack[Number(s)];
          attackerSlot = Number(s);
        }
      });

      if (!attacker) return state;

      // Find target
      let target: GameCard | null = null;
      let targetSlot: number = 0;
      let targetMode: 'Attack' | 'Defense' = 'Attack';
      
      Object.keys(targetField.attack).forEach(s => {
        if (targetField.attack[Number(s)]?.instanceId === targetInstanceId) {
          target = targetField.attack[Number(s)];
          targetSlot = Number(s);
          targetMode = 'Attack';
        }
      });
      Object.keys(targetField.defense).forEach(s => {
        if (targetField.defense[Number(s)]?.instanceId === targetInstanceId) {
          target = targetField.defense[Number(s)];
          targetSlot = Number(s);
          targetMode = 'Defense';
        }
      });

      if (!target) return state;

      const attackerCat = cardCatalog.find(c => c.id === attacker!.cardId) as CreatureCard;
      const targetCat = cardCatalog.find(c => c.id === target!.cardId) as CreatureCard;

      if (!attackerCat || !targetCat) return state;

      // Damage calculation
      if (targetCat.isGasOrWater) {
        // Immune to normal physical attacks. (Could add visual effect here)
        return {
          attackerCardId: null,
          cardsThatAttacked: [...state.cardsThatAttacked, attacker.instanceId]
        };
      }

      if (targetMode === 'Attack') {
        if (attackerCat.attack >= targetCat.attack) {
          // Target is destroyed
          targetField.attack[targetSlot] = null;
        } 
        if (targetCat.attack >= attackerCat.attack) {
          // Attacker is also destroyed if target attack is greater or equal
          attackerField.attack[attackerSlot] = null;
        }
      } else {
        // Target is in Defense
        const currentDef = target.currentDefense || targetCat.defense;
        if (attackerCat.attack > currentDef) {
          // Target destroyed
          targetField.defense[targetSlot] = null;
        } else {
          // Target survives, defense is reduced
          target.currentDefense = currentDef - attackerCat.attack;
        }
      }

      return {
        attackerCardId: null,
        cardsThatAttacked: [...state.cardsThatAttacked, attacker.instanceId],
        playerField: isPlayerTurn ? attackerField : targetField,
        opponentField: isPlayerTurn ? targetField : attackerField,
      };
    });
  },

  nextPhase: () => {
    set((state) => {
      if (state.phase === 'Anomaly') return { phase: 'Main', selectedCardIdFromHand: null, sacrificeSelection: [], attackerCardId: null };
      if (state.phase === 'Main') return { phase: 'End', selectedCardIdFromHand: null, sacrificeSelection: [], attackerCardId: null };
      return state;
    });
  },

  endTurn: () => {
    set((state) => {
      const nextTurn = state.currentTurn === 'Player' ? 'Opponent' : 'Player';
      return {
        currentTurn: nextTurn,
        phase: 'Anomaly',
        selectedCardIdFromHand: null,
        sacrificeSelection: [],
        attackerCardId: null,
        cardsThatAttacked: []
      };
    });
    get().drawCard(get().currentTurn, 1);
  }
}));
