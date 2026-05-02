import { create } from 'zustand';
import { Card, GameCard, BoardPosition, CreatureCard } from '../types/game';
import { cardCatalog } from '../data/cards';

export type GamePhase = 'StarCheck' | 'Anomaly' | 'MainAction' | 'Discard';
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
  
  winner: PlayerTurn | null;

  selectedCardIdFromHand: string | null;
  sacrificeSelection: string[];
  
  // Turn flags
  hasPlacedCardThisTurn: boolean;
  hasAttackedThisTurn: boolean;
  hasPlayedAnomalyThisTurn: boolean;
  starPowerUses: Record<string, number>; // instanceId -> uses
  
  // Combat State
  attackerCardId: string | null;
  cardsThatAttacked: string[]; // Resets every turn
  
  startGame: (playerDeck: Card[], opponentDeck: Card[]) => void;
  drawCard: (player: PlayerTurn, count?: number) => void;
  discardCard: (instanceId: string) => void;
  selectCardFromHand: (instanceId: string | null) => void;
  toggleSacrificeSelection: (instanceId: string) => void;
  playCardToField: (player: PlayerTurn, instanceId: string, slot: BoardPosition, mode: 'Attack' | 'Defense') => void;
  selectAttacker: (instanceId: string | null) => void;
  executeAttack: (targetInstanceId: string) => void;
  useStarPower: (targetInstanceId: string) => void;
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
  phase: 'StarCheck',
  winner: null,
  
  selectedCardIdFromHand: null,
  sacrificeSelection: [],
  hasPlacedCardThisTurn: false,
  hasAttackedThisTurn: false,
  hasPlayedAnomalyThisTurn: false,
  starPowerUses: {},
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
      phase: 'StarCheck',
      winner: null,
      selectedCardIdFromHand: null,
      sacrificeSelection: [],
      hasPlacedCardThisTurn: false,
      hasAttackedThisTurn: false,
      hasPlayedAnomalyThisTurn: false,
      starPowerUses: {},
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
          
          const catalogCard = cardCatalog.find(c => c.id === gameCard.cardId);
          if (catalogCard && catalogCard.type !== 'Anomaly') {
            const creature = catalogCard as CreatureCard;
            gameCard.currentDefense = creature.defense; // Defense is HP now
          }

          hand.push(gameCard);
        }
      }
      
      return { [deckKey]: deck, [handKey]: hand };
    });
  },

  discardCard: (instanceId) => {
    const state = get();
    if (state.phase !== 'Discard') return;

    const handKey = state.currentTurn === 'Player' ? 'playerHand' : 'opponentHand';
    const hand = state[handKey].filter(c => c.instanceId !== instanceId);
    
    if (hand.length < state[handKey].length) {
      set({ [handKey]: hand });
      get().drawCard(state.currentTurn, 1);
      get().endTurn();
    }
  },


  selectCardFromHand: (instanceId) => {
    set({ selectedCardIdFromHand: instanceId, sacrificeSelection: [], attackerCardId: null });
  },

  toggleSacrificeSelection: (instanceId) => {
    set((state) => {
      const current = state.sacrificeSelection;
      if (current.includes(instanceId)) {
        return { sacrificeSelection: current.filter(id => id !== instanceId) };
      } else if (current.length < 4) { // Up to 4 for Ra
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
      
      const gameCard = { ...hand[cardIndex] };
      const catalogCard = cardCatalog.find(c => c.id === gameCard.cardId);
      if (!catalogCard) return state;

      // Restrict actions per turn
      if (catalogCard.type === 'Anomaly') {
        if (state.hasPlayedAnomalyThisTurn) return state;
      } else {
        if (state.hasPlacedCardThisTurn || state.hasAttackedThisTurn) return state;
      }

      const newField = { ...state[fieldKey] };
      newField.attack = { ...newField.attack };
      newField.defense = { ...newField.defense };
      newField.anomalies = [...newField.anomalies];
      
      if (state.sacrificeSelection.length > 0) {
        state.sacrificeSelection.forEach(sacId => {
          Object.keys(newField.attack).forEach(s => {
            const numSlot = Number(s);
            if (newField.attack[numSlot]?.instanceId === sacId) newField.attack[numSlot] = null;
          });
          Object.keys(newField.defense).forEach(s => {
            const numSlot = Number(s);
            if (newField.defense[numSlot]?.instanceId === sacId) newField.defense[numSlot] = null;
          });
        });
      }

      gameCard.position = slot;
      gameCard.mode = mode;
      
      if (catalogCard.type === 'Anomaly') {
         newField.anomalies.push(gameCard);
      } else {
        if (mode === 'Attack') newField.attack[slot] = gameCard;
        else newField.defense[slot] = gameCard;
      }
      
      hand.splice(cardIndex, 1);
      
      // Check Win Condition
      let winner = state.winner;
      if (catalogCard.type === 'Star') {
        winner = player;
      }
      
      return { 
        [handKey]: hand, 
        [fieldKey]: newField,
        winner,
        selectedCardIdFromHand: null,
        sacrificeSelection: [],
        hasPlacedCardThisTurn: catalogCard.type !== 'Anomaly' ? true : state.hasPlacedCardThisTurn,
        hasPlayedAnomalyThisTurn: catalogCard.type === 'Anomaly' ? true : state.hasPlayedAnomalyThisTurn
      };
    });
  },

  selectAttacker: (instanceId) => {
    const state = get();
    if (state.hasPlacedCardThisTurn || state.hasAttackedThisTurn) return;
    set({ attackerCardId: instanceId, selectedCardIdFromHand: null });
  },

  executeAttack: (targetInstanceId) => {
    set((state) => {
      if (!state.attackerCardId) return state;
      if (state.hasPlacedCardThisTurn || state.hasAttackedThisTurn) return state;
      
      const isPlayerTurn = state.currentTurn === 'Player';
      const playerField = { ...state.playerField };
      const opponentField = { ...state.opponentField };
      
      const attackerField = isPlayerTurn ? playerField : opponentField;
      const targetField = isPlayerTurn ? opponentField : playerField;

      attackerField.attack = { ...attackerField.attack };
      targetField.attack = { ...targetField.attack };
      targetField.defense = { ...targetField.defense };

      // Find attacker
      let attacker: GameCard | null = null;
      let attackerSlot: number = 0;
      Object.keys(attackerField.attack).forEach(s => {
        const numSlot = Number(s);
        if (attackerField.attack[numSlot]?.instanceId === state.attackerCardId) {
          attacker = { ...attackerField.attack[numSlot]! };
          attackerSlot = numSlot;
        }
      });

      if (!attacker) return state;
      const attackerInstanceId = (attacker as GameCard).instanceId;
      const attackerCardId = (attacker as GameCard).cardId;

      // Find target
      let target: GameCard | null = null;
      let targetSlot: number = 0;
      let targetMode: 'Attack' | 'Defense' = 'Attack';
      
      for (const s of Object.keys(targetField.attack)) {
        const numSlot = Number(s);
        const card = targetField.attack[numSlot];
        if (card?.instanceId === targetInstanceId) {
          target = { ...card };
          targetSlot = numSlot;
          targetMode = 'Attack';
          break;
        }
      }

      if (!target) {
        for (const s of Object.keys(targetField.defense)) {
          const numSlot = Number(s);
          const card = targetField.defense[numSlot];
          if (card?.instanceId === targetInstanceId) {
            target = { ...card };
            targetSlot = numSlot;
            targetMode = 'Defense';
            break;
          }
        }
      }

      if (!target) return state;
      const targetInstanceId_loc = (target as GameCard).instanceId;
      const targetCardId_loc = (target as GameCard).cardId;

      const attackerCat = cardCatalog.find(c => c.id === attackerCardId) as CreatureCard;
      const targetCat = cardCatalog.find(c => c.id === targetCardId_loc) as CreatureCard;

      if (!attackerCat || !targetCat) return state;

      // Immunities
      if (targetCat.isGasOrWater) {
        return {
          attackerCardId: null,
          hasAttackedThisTurn: true,
          cardsThatAttacked: [...state.cardsThatAttacked, attackerInstanceId]
        };
      }
      
      if (targetCat.id === 'dwarf_sedna' && attackerCat.attack < 700) {
        return {
          attackerCardId: null,
          hasAttackedThisTurn: true,
          cardsThatAttacked: [...state.cardsThatAttacked, attackerInstanceId]
        };
      }

      // Damage calculation (Accumulative)
      const targetBonus = targetMode === 'Defense' ? (targetCat.defenseBonus || 0) : 0;
      const targetCurrentHp = ((target as GameCard).currentDefense ?? targetCat.defense) + targetBonus;
      const finalTargetHp = targetCurrentHp - attackerCat.attack;

      if (finalTargetHp <= 0) {
        if (targetMode === 'Attack') targetField.attack[targetSlot] = null;
        else targetField.defense[targetSlot] = null;
      } else {
        (target as GameCard).currentDefense = Math.max(1, finalTargetHp - targetBonus);
        if (targetMode === 'Attack') targetField.attack[targetSlot] = target;
        else targetField.defense[targetSlot] = target;
      }
      
      // Counter-attack ONLY if target was in Attack mode
      if (targetMode === 'Attack') {
        const attackerCurrentHp = (attacker as GameCard).currentDefense ?? attackerCat.defense;
        const finalAttackerHp = attackerCurrentHp - targetCat.attack;
        
        if (finalAttackerHp <= 0) {
          attackerField.attack[attackerSlot] = null;
        } else {
          (attacker as GameCard).currentDefense = finalAttackerHp;
          attackerField.attack[attackerSlot] = attacker;
        }
      }

      return {
        attackerCardId: null,
        hasAttackedThisTurn: true,
        cardsThatAttacked: [...state.cardsThatAttacked, attackerInstanceId],
        playerField,
        opponentField,
      };
    });
  },

  useStarPower: (targetInstanceId) => {
    set((state) => {
      if (state.phase !== 'StarCheck') return state;
      
      const isPlayerTurn = state.currentTurn === 'Player';
      const playerField = { ...state.playerField };
      const opponentField = { ...state.opponentField };
      
      const targetField = isPlayerTurn ? opponentField : playerField;
      targetField.attack = { ...targetField.attack };
      targetField.defense = { ...targetField.defense };

      // Find target
      let target: GameCard | null = null;
      let targetSlot: number = 0;
      let targetMode: 'Attack' | 'Defense' = 'Attack';
      
      for (const s of Object.keys(targetField.attack)) {
        const numSlot = Number(s);
        const card = targetField.attack[numSlot];
        if (card?.instanceId === targetInstanceId) {
          target = { ...card };
          targetSlot = numSlot;
          targetMode = 'Attack';
          break;
        }
      }

      if (!target) {
        for (const s of Object.keys(targetField.defense)) {
          const numSlot = Number(s);
          const card = targetField.defense[numSlot];
          if (card?.instanceId === targetInstanceId) {
            target = { ...card };
            targetSlot = numSlot;
            targetMode = 'Defense';
            break;
          }
        }
      }

      if (!target) return state;

      // Fixed 50 damage
      const currentHp = (target as GameCard).currentDefense ?? 0;
      const finalHp = currentHp - 50;

      if (finalHp <= 0) {
        if (targetMode === 'Attack') targetField.attack[targetSlot] = null;
        else targetField.defense[targetSlot] = null;
      } else {
        (target as GameCard).currentDefense = finalHp;
        if (targetMode === 'Attack') targetField.attack[targetSlot] = target;
        else targetField.defense[targetSlot] = target;
      }

      return {
        playerField,
        opponentField,
      };
    });
  },

  nextPhase: () => {
    set((state) => {
      if (state.phase === 'StarCheck') return { phase: 'Anomaly' };
      if (state.phase === 'Anomaly') return { phase: 'MainAction', selectedCardIdFromHand: null, sacrificeSelection: [], attackerCardId: null };
      if (state.phase === 'MainAction') return { phase: 'Discard', selectedCardIdFromHand: null, sacrificeSelection: [], attackerCardId: null };
      return state;
    });
  },

  endTurn: () => {
    const state = get();
    const nextTurn = state.currentTurn === 'Player' ? 'Opponent' : 'Player';
    
    // Draw cards to replenish hand to 5 at the end of turn
    const handKey = state.currentTurn === 'Player' ? 'playerHand' : 'opponentHand';
    const currentHandSize = state[handKey].length;
    if (currentHandSize < 5) {
      get().drawCard(state.currentTurn, 5 - currentHandSize);
    }

    set({
      currentTurn: nextTurn,
      phase: 'StarCheck',
      selectedCardIdFromHand: null,
      sacrificeSelection: [],
      hasPlacedCardThisTurn: false,
      hasAttackedThisTurn: false,
      hasPlayedAnomalyThisTurn: false,
      attackerCardId: null,
      cardsThatAttacked: []
    });
  }

}));
