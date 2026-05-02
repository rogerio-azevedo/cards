import React from 'react';
import { GameCard } from '../../types/game';
import { cardCatalog } from '../../data/cards';
import { PlayingCard } from './PlayingCard';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useGameStore } from '../../store/gameStore';

interface HandProps {
  cards: GameCard[];
  isOpponent?: boolean;
}

export const Hand: React.FC<HandProps> = ({ cards, isOpponent = false }) => {
  const { 
    selectedCardIdFromHand, 
    selectCardFromHand, 
    currentTurn, 
    phase, 
    discardCard,
    hasPlacedCardThisTurn,
    hasAttackedThisTurn,
    hasPlayedAnomalyThisTurn
  } = useGameStore();

  const isPlayerTurn = currentTurn === 'Player';

  if (isOpponent) {
    return (
      <div className="flex justify-center -space-x-12 scale-75 opacity-80 pointer-events-none absolute top-[-80px] w-full">
        {cards.map((card, idx) => (
          <PlayingCard key={`opp-hand-${card.instanceId}-${idx}`} card={cardCatalog[0]} isFaceDown={true} />
        ))}
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center pb-8 z-50 pointer-events-none">
      <div className="flex justify-center -space-x-6 pointer-events-auto max-w-[90vw]">
        <AnimatePresence>
          {cards.map((gameCard, index) => {
            const catalogCard = cardCatalog.find(c => c.id === gameCard.cardId);
            if (!catalogCard) return null;

            const isSelected = selectedCardIdFromHand === gameCard.instanceId;
            const offset = index - (cards.length - 1) / 2;
            const rotation = isSelected ? 0 : offset * 3;
            const translateY = isSelected ? -100 : Math.abs(offset) * 8;

            const isAnomaly = catalogCard.type === 'Anomaly';
            
            // Playability logic
            let isPlayable = false;
            if (isPlayerTurn) {
              if (phase === 'Anomaly' && isAnomaly && !hasPlayedAnomalyThisTurn) isPlayable = true;
              if (phase === 'MainAction' && !isAnomaly && !hasPlacedCardThisTurn && !hasAttackedThisTurn) isPlayable = true;
              if (phase === 'Discard' && !hasPlacedCardThisTurn) isPlayable = true;
            }

            return (
              <motion.div
                key={`hand-${gameCard.instanceId}`}
                initial={{ y: 200, opacity: 0, scale: 0.5 }}
                animate={{ 
                  y: translateY, 
                  rotate: rotation,
                  opacity: 1,
                  scale: isSelected ? 1.2 : 1,
                  zIndex: isSelected ? 100 : index
                }}
                exit={{ y: 300, opacity: 0, scale: 0.5 }}
                whileHover={{ 
                  y: isSelected ? -100 : -60, 
                  rotate: 0, 
                  scale: 1.2,
                  zIndex: 200,
                  transition: { duration: 0.2, type: 'spring', stiffness: 300 }
                }}
                className={cn(
                  "relative origin-bottom cursor-pointer transition-all duration-300",
                  isSelected && "shadow-[0_0_50px_rgba(59,130,246,0.6)] rounded-xl",
                  !isPlayable && !isSelected && "grayscale-[0.8] opacity-60 hover:grayscale-0 hover:opacity-100"
                )}
                onClick={() => {
                  if (phase === 'Discard') {
                    if (confirm(`Deseja descartar ${catalogCard.name} para comprar uma nova carta?`)) {
                      discardCard(gameCard.instanceId);
                    }
                  } else {
                    selectCardFromHand(isSelected ? null : gameCard.instanceId);
                  }
                }}
              >
                <PlayingCard card={catalogCard} className="shadow-2xl border-white/20" />
                
                {phase === 'Discard' && isPlayable && (
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-tighter">
                     Descartar
                   </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
