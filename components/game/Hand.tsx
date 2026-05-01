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
  const { selectedCardIdFromHand, selectCardFromHand, currentTurn, phase } = useGameStore();

  if (isOpponent) {
    return (
      <div className="flex justify-center -space-x-8 scale-75 opacity-80 pointer-events-none absolute top-[-60px]">
        {cards.map((card, idx) => (
          <PlayingCard key={`opp-hand-${card.instanceId}-${idx}`} card={cardCatalog[0]} isFaceDown={true} />
        ))}
      </div>
    );
  }

  const canPlay = currentTurn === 'Player' && phase === 'Main';

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center pb-4 z-50 pointer-events-none">
      <div className="flex justify-center -space-x-4 pointer-events-auto">
        <AnimatePresence>
          {cards.map((gameCard, index) => {
            const catalogCard = cardCatalog.find(c => c.id === gameCard.cardId);
            if (!catalogCard) return null;

            const isSelected = selectedCardIdFromHand === gameCard.instanceId;
            const offset = index - (cards.length - 1) / 2;
            const rotation = isSelected ? 0 : offset * 4;
            const translateY = isSelected ? -80 : Math.abs(offset) * 5;

            return (
              <motion.div
                key={`hand-${gameCard.instanceId}`}
                initial={{ y: 100, opacity: 0 }}
                animate={{ 
                  y: translateY, 
                  rotate: rotation,
                  opacity: 1,
                  scale: isSelected ? 1.15 : 1,
                  zIndex: isSelected ? 60 : index
                }}
                exit={{ y: 200, opacity: 0 }}
                whileHover={{ 
                  y: isSelected ? -80 : -40, 
                  rotate: 0, 
                  scale: 1.15,
                  zIndex: 50,
                  transition: { duration: 0.2 }
                }}
                className={cn(
                  "relative origin-bottom cursor-pointer transition-shadow",
                  isSelected && "shadow-[0_0_30px_rgba(59,130,246,0.8)] rounded-xl"
                )}
                onClick={() => {
                  selectCardFromHand(isSelected ? null : gameCard.instanceId);
                }}
              >
                <PlayingCard card={catalogCard} className="shadow-2xl" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
