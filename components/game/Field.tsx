import React from 'react';
import { useGameStore, FieldSlots } from '../../store/gameStore';
import { cardCatalog } from '../../data/cards';
import { PlayingCard } from './PlayingCard';
import { cn } from '../../lib/utils';
import { BoardPosition } from '../../types/game';

interface FieldProps {
  field: FieldSlots;
  isOpponent?: boolean;
}

const EmptySlot = ({ 
  isDefense, 
  isOpponent,
  isHighlight,
  onClick
}: { 
  isDefense?: boolean; 
  isOpponent?: boolean;
  isHighlight?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center bg-black/20 transition-all",
        isDefense ? "w-48 h-32" : "w-32 h-48",
        isOpponent && isDefense && "opacity-50",
        isHighlight && !isOpponent && "border-blue-500 bg-blue-500/20 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:bg-blue-500/40"
      )}
    >
      <span className="text-white/30 text-xs font-bold uppercase">{isDefense ? 'Defesa' : 'Ataque'}</span>
    </div>
  );
};

export const Field: React.FC<FieldProps> = ({ field, isOpponent = false }) => {
  const { 
    selectedCardIdFromHand, 
    playerHand, 
    playCardToField, 
    toggleSacrificeSelection,
    sacrificeSelection,
    phase,
    attackerCardId,
    selectAttacker,
    executeAttack,
    cardsThatAttacked,
    hasPlacedCardThisTurn,
    hasAttackedThisTurn
  } = useGameStore();

  const slots: BoardPosition[] = [1, 2, 3, 4, 5];

  const selectedCard = selectedCardIdFromHand 
    ? playerHand.find(c => c.instanceId === selectedCardIdFromHand)
    : null;
  const catalogSelected = selectedCard 
    ? cardCatalog.find(c => c.id === selectedCard.cardId)
    : null;

  const isSlotPlayable = (slot: BoardPosition) => {
    if (isOpponent || !catalogSelected || !selectedCard) return false;
    
    // Anomalias não são jogadas em slots normais
    if (catalogSelected.type === 'Anomaly') return false;

    if (phase !== 'MainAction') return false;
    if (hasPlacedCardThisTurn || hasAttackedThisTurn) return false;

    if (catalogSelected.type === 'Planet' || catalogSelected.type === 'Star') {
      const requiredSacrifices = catalogSelected.type === 'Star' ? 4 : 3;
      if (sacrificeSelection.length < requiredSacrifices) return false;
    }
    
    // Agora garantimos que é uma CreatureCard
    const creatureCat = catalogSelected as import('../../types/game').CreatureCard;
    return creatureCat.allowedSlots?.includes(slot) || false;
  };

  const handleSlotClick = (slot: BoardPosition, mode: 'Attack' | 'Defense') => {
    if (!isSlotPlayable(slot) || !selectedCardIdFromHand) return;
    playCardToField('Player', selectedCardIdFromHand, slot, mode);
  };

  const handleCardClick = (instanceId: string, slot: BoardPosition, mode: 'Attack' | 'Defense') => {
    // Handling Star Power (Helios)
    if (phase === 'StarCheck' && isOpponent) {
       // Check if player has Helios on field (simplified for now)
       useGameStore.getState().useStarPower(instanceId);
       return;
    }

    // Handling Attacks
    if (phase === 'MainAction' && !selectedCardIdFromHand) {
      if (!isOpponent && mode === 'Attack') {
        // Select as attacker if it hasn't attacked yet and no other action taken
        if (!cardsThatAttacked.includes(instanceId) && !hasPlacedCardThisTurn && !hasAttackedThisTurn) {
          selectAttacker(attackerCardId === instanceId ? null : instanceId);
        }
        return;
      }
      
      if (isOpponent && attackerCardId) {
        // Check if target is valid (cannot attack Attack card if there is a Defense card protecting it)
        const hasDefenseProtector = field.defense[slot] !== null;
        if (mode === 'Attack' && hasDefenseProtector) {
          return;
        }
        executeAttack(instanceId);
        return;
      }
    }

    // Handling Sacrifices
    if (!isOpponent && catalogSelected) {
      if (catalogSelected.type === 'Planet' || catalogSelected.type === 'Star') {
        toggleSacrificeSelection(instanceId);
      }
    }
  };

  const renderDefenseRow = () => (
    <div className="flex justify-center gap-4 w-full">
      {slots.map(slot => {
        const gameCard = field.defense[slot];
        const catalogCard = gameCard ? cardCatalog.find(c => c.id === gameCard.cardId) : null;
        
        const isSacrificeTarget = gameCard && sacrificeSelection.includes(gameCard.instanceId);
        const playable = isSlotPlayable(slot) && !gameCard;
        const isTargetable = isOpponent && attackerCardId && gameCard; // Can always attack defense

        return (
          <div key={`def-${slot}`} className="flex items-center justify-center w-48 h-36 relative">
            {catalogCard && gameCard ? (
              <div 
                className={cn(
                  "rotate-90 origin-center transition-all",
                  catalogSelected && !isOpponent && "cursor-pointer hover:scale-105",
                  isSacrificeTarget && "shadow-[0_0_20px_rgba(239,68,68,0.8)] rounded-xl scale-105 border-2 border-red-500",
                  isTargetable && "cursor-crosshair hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.8)] border-2 border-yellow-500 rounded-xl"
                )}
                onClick={() => handleCardClick(gameCard.instanceId, slot, 'Defense')}
              >
                <PlayingCard 
                  card={catalogCard} 
                  isFaceDown={isOpponent} 
                  currentDefense={gameCard.currentDefense}
                  isDefenseMode={true}
                />
                {isSacrificeTarget && (
                  <div className="absolute inset-0 bg-red-500/30 rounded-xl pointer-events-none" />
                )}
              </div>
            ) : (
              <EmptySlot 
                isDefense 
                isOpponent={isOpponent} 
                isHighlight={playable}
                onClick={() => playable && handleSlotClick(slot, 'Defense')}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderAttackRow = () => (
    <div className="flex justify-center gap-4 w-full">
      {slots.map(slot => {
        const gameCard = field.attack[slot];
        const catalogCard = gameCard ? cardCatalog.find(c => c.id === gameCard.cardId) : null;
        
        const isSacrificeTarget = gameCard && sacrificeSelection.includes(gameCard.instanceId);
        const playable = isSlotPlayable(slot) && !gameCard;
        const canPlayOnSacrifice = isSacrificeTarget && isSlotPlayable(slot);
        
        const isAttacker = gameCard?.instanceId === attackerCardId;
        const hasAttacked = gameCard && cardsThatAttacked.includes(gameCard.instanceId);
        
        // Targetable if opponent, attacker is selected, and no defense card protecting it
        const isProtected = field.defense[slot] !== null;
        const isTargetable = isOpponent && attackerCardId && gameCard && !isProtected;

        const requiredSacrifices = catalogSelected?.type === 'Star' ? 4 : 3;

        return (
          <div key={`atk-${slot}`} className="flex items-center justify-center w-36 h-52 relative">
            {catalogCard && gameCard ? (
              <div 
                className={cn(
                  "transition-all",
                  catalogSelected && !isOpponent && "cursor-pointer hover:scale-105",
                  isSacrificeTarget && "shadow-[0_0_20px_rgba(239,68,68,0.8)] rounded-xl scale-105 border-2 border-red-500",
                  !isOpponent && phase === 'MainAction' && !hasAttacked && !selectedCardIdFromHand && "cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]",
                  isAttacker && "shadow-[0_0_30px_rgba(234,179,8,1)] scale-110 z-10 rounded-xl",
                  hasAttacked && "opacity-50 grayscale pointer-events-none",
                  isTargetable && "cursor-crosshair hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.8)] border-2 border-yellow-500 rounded-xl"
                )}
                onClick={() => {
                  if (canPlayOnSacrifice && sacrificeSelection.length === requiredSacrifices) {
                    handleSlotClick(slot, 'Attack');
                  } else {
                    handleCardClick(gameCard.instanceId, slot, 'Attack');
                  }
                }}
              >
                <PlayingCard 
                  card={catalogCard} 
                  isFaceDown={isOpponent} 
                  currentDefense={gameCard.currentDefense}
                  isDefenseMode={false}
                />
                {isSacrificeTarget && (
                  <div className="absolute inset-0 bg-red-500/30 rounded-xl pointer-events-none" />
                )}
                {canPlayOnSacrifice && sacrificeSelection.length === requiredSacrifices && (
                  <div className="absolute inset-0 bg-blue-500/50 rounded-xl border border-blue-400 flex items-center justify-center animate-pulse">
                    <span className="bg-black text-white text-xs px-2 py-1 rounded font-bold">Colocar Aqui</span>
                  </div>
                )}
              </div>
            ) : (
              <EmptySlot 
                isOpponent={isOpponent} 
                isHighlight={playable}
                onClick={() => playable && handleSlotClick(slot, 'Attack')}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={cn("flex flex-col gap-4 w-full", isOpponent && "flex-col-reverse")}>
      {isOpponent ? (
        <>
          {renderAttackRow()}
          {renderDefenseRow()}
        </>
      ) : (
        <>
          {renderDefenseRow()}
          {renderAttackRow()}
        </>
      )}
    </div>
  );
};
