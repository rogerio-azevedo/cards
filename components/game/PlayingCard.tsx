import React from 'react';
import { Card as CardType, CreatureCard } from '../../types/game';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Shield, Swords, Zap, Star } from 'lucide-react';

interface PlayingCardProps {
  card: CardType;
  onClick?: () => void;
  className?: string;
  isFaceDown?: boolean;
  currentDefense?: number;
  isDefenseMode?: boolean;
}

const rarityColors = {
  Common: 'bg-slate-300 border-slate-400 text-slate-800',
  Rare: 'bg-blue-300 border-blue-500 text-blue-900',
  Epic: 'bg-purple-300 border-purple-500 text-purple-900',
  Legendary: 'bg-amber-300 border-yellow-500 text-amber-900',
};

const typeIcons = {
  Star: Star,
  Planet: Zap,
  Moon: Shield,
  DwarfPlanet: Shield,
  Anomaly: Zap,
};

export const PlayingCard: React.FC<PlayingCardProps> = ({ 
  card, 
  onClick, 
  className, 
  isFaceDown = false,
  currentDefense,
  isDefenseMode = false
}) => {
  if (isFaceDown) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={cn(
          "w-24 h-36 sm:w-32 sm:h-48 rounded-xl border-4 border-indigo-900 bg-indigo-950 flex items-center justify-center cursor-pointer shadow-lg",
          className
        )}
        onClick={onClick}
      >
        <div className="w-16 h-24 sm:w-24 sm:h-36 border-2 border-indigo-800/50 rounded-lg flex items-center justify-center opacity-50">
          <Star className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-800" />
        </div>
      </motion.div>
    );
  }

  const isCreature = card.type !== 'Anomaly';
  const creatureCard = isCreature ? (card as CreatureCard) : null;
  const TypeIcon = typeIcons[card.type];
  
  // Use currentDefense if provided, otherwise fallback to base defense
  const displayDefense = currentDefense !== undefined ? currentDefense : (creatureCard?.defense || 0);
  const bonus = (isDefenseMode && creatureCard?.defenseBonus) ? creatureCard.defenseBonus : 0;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn(
        "w-24 h-36 sm:w-36 sm:h-52 rounded-xl border-2 sm:border-4 flex flex-col p-1.5 sm:p-2 relative shadow-lg select-none",
        rarityColors[card.rarity],
        className,
        isDefenseMode && "ring-2 sm:ring-4 ring-blue-400 ring-offset-1 sm:ring-offset-2"
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-0.5 sm:mb-1">
        <span className="font-bold text-[10px] sm:text-xs truncate max-w-[80%]">{card.name}</span>
        <TypeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
      </div>

      {/* Image / Art Placeholder */}
      <div className="flex-1 w-full bg-black/10 rounded-md border border-black/10 mb-0.5 sm:mb-1 flex items-center justify-center relative overflow-hidden">
        {/* Placeholder Art */}
        <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-white/40 to-black/20 flex items-center justify-center shadow-inner relative">
          {/* Cute Face Placeholder */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-3 w-1 sm:w-2 h-1 sm:h-2 bg-black rounded-full" />
          <div className="absolute top-2 sm:top-4 right-2 sm:right-3 w-1 sm:w-2 h-1 sm:h-2 bg-black rounded-full" />
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-1 sm:h-2 border-b-2 border-black rounded-full" />
        </div>
      </div>

      {/* Description */}
      <div className="h-8 sm:h-12 text-[7px] sm:text-[9px] leading-tight overflow-hidden text-black/80 font-medium">
        {card.description}
      </div>

      {/* Stats row for Creatures */}
      {isCreature && creatureCard && (
        <div className="flex justify-between items-end mt-auto pt-0.5 sm:pt-1 border-t border-black/10">
          <div className="flex items-center gap-0.5 sm:gap-1 font-bold text-[10px] sm:text-xs bg-red-500/20 px-0.5 sm:px-1 rounded">
            <Swords className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            {creatureCard.attack}
          </div>
          <div className="flex flex-col items-end">
             {bonus > 0 && (
               <span className="text-[6px] sm:text-[8px] text-blue-600 font-bold">+{bonus} Bonus</span>
             )}
            <div className="flex items-center gap-0.5 sm:gap-1 font-bold text-[10px] sm:text-xs bg-blue-500/20 px-0.5 sm:px-1 rounded">
              <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              {displayDefense}
              {currentDefense !== undefined && <span className="text-[7px] sm:text-[8px] opacity-50 ml-0.5">/{creatureCard.defense}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Allowed Slots badges on top edge */}
      {isCreature && creatureCard && (
        <div className="absolute -top-1.5 sm:-top-2 left-1/2 -translate-x-1/2 flex gap-0.5">
          {creatureCard.allowedSlots.map(slot => (
            <div key={slot} className="w-3 h-3 sm:w-4 sm:h-4 bg-black text-white text-[8px] sm:text-[10px] flex items-center justify-center rounded-full font-bold shadow">
              {slot}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

